/**
 * File: components/molecules/signature-upload.tsx
 * Description: Signature upload component for handling signature file uploads.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides signature upload functionality with:
 * - File upload support
 * - Progress tracking
 * - File preview
 * - S3 integration
 * - Responsive design
 * - Accessibility features
 */

import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { uploadFileToS3, getS3FileUrl } from "@/lib/aws-upload";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useLazyQuery } from "@apollo/client";
import { GET_S3_FILE_ADMIN } from "@/lib/graphql/queries";

interface SignatureUploadProps {
  value?: string;
  onUpload: (url: string) => void;
  title?: string;
  ptype: string;
  viewOnly?: boolean;
  userBucket?: string;
  showDelete?: boolean;
}

/**
 * SignatureUpload Component
 *
 * Handles signature file uploads with progress tracking and preview.
 *
 * Features:
 * - File upload support
 * - Progress tracking
 * - File preview
 * - S3 integration
 * - Responsive design
 * - Accessibility features
 *
 * @param {Object} props - Component props
 * @param {function} props.onUpload - Function to handle upload completion
 * @param {string} [props.userBucket] - Bucket name for admin access
 * @param {boolean} [props.viewOnly] - Flag to indicate if the component is in view-only mode
 * @returns {JSX.Element} Signature upload component
 *
 * @example
 * ```tsx
 * <SignatureUpload
 *   onUpload={(url) => console.log("Upload complete:", url)}
 *   userBucket="user-bucket-name"
 *   viewOnly={false}
 * />
 * ```
 */
const SignatureUpload: React.FC<SignatureUploadProps> = ({
  onUpload,
  title = "Upload Signature",
  ptype,
  viewOnly = false,
  value,
  userBucket,
  showDelete = true,
}) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [clearHover, setClearHover] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useUserProfileStore();

  const [getS3AdminURL, { error: s3FileError }] =
    useLazyQuery(GET_S3_FILE_ADMIN);

  useEffect(() => {
    const fetchPreview = async () => {
      if (viewOnly && value && ptype) {
        try {
          let url: string;
          // If user has approval permissions and userBucket is provided, use admin function
          if (user?.permissions?.canApproveRegistration && userBucket) {
            console.log("userBucket", userBucket);
            console.log("value", value);

            const fileName = value.split("@")[0];

            console.log("fileName", fileName);

            const { data } = await getS3AdminURL({
              variables: {
                input: {
                  bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                  key: `private/${userBucket}/${fileName}`,
                },
              },
            });

            if (s3FileError) {
              throw new Error("Failed to get admin file URL");
            }

            url = data?.signurl?.url;
          } else {
            url = await getS3FileUrl(value, "private");
          }
          setPreviewUrl(url);
        } catch (error) {
          console.error("Error fetching signature preview:", error);
          setError("Failed to load signature preview");
        }
      }
    };
    fetchPreview();
  }, [
    viewOnly,
    value,
    ptype,
    user?.permissions?.canApproveRegistration,
    userBucket,
    getS3AdminURL,
    s3FileError,
  ]);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setError(null);
    setHasSignature(false);
  };

  const handleDone = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setError("Please provide a signature before uploading.");
      return;
    }
    setError(null);
    try {
      const dataUrl = sigCanvasRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      // Convert dataURL to File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const timestamp = Date.now();
      const fileName = `${userBucket}/${Date.now()}-${value.name}`;
      const file = new File([blob], fileName, {
        type: "image/png",
      });
      // Upload file using the correct folder and filename
      await uploadFileToS3(file, "private", fileName);
      // Save just the filename instead of the full URL
      onUpload(fileName);
    } catch {
      setError("Failed to upload signature.");
    }
  };

  // Set hasSignature to true when user draws
  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Label className="text-sm font-medium pl-2 text-muted-foreground">
        {title}
      </Label>
      <Card className="w-full max-w-md p-0">
        <CardContent className="p-4">
          {viewOnly && value ? (
            <div className="flex flex-col items-center justify-center h-32 w-full rounded-md p-2 transition-colors relative border-2 border-blue-500 bg-blue-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Signature preview"
                  className="max-h-24 object-contain border rounded bg-white"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    Loading signature...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col items-center justify-center h-32 w-full rounded-md p-2 transition-colors relative",
                hasSignature
                  ? "border-2 border-blue-500 bg-blue-50"
                  : isHovered
                  ? "border-2 border-dashed border-blue-500 bg-blue-50"
                  : "border-2 border-dashed border-gray-300 bg-muted"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {hasSignature ? (
                <>
                  <TooltipProvider>
                    {!viewOnly && showDelete && (
                      <div className="absolute right-12 top-6 -translate-y-1/2 z-20 flex flex-col gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={handleClear}
                              className="p-2 rounded text-foreground hover:bg-muted cursor-pointer animate-slide-right-fade-in"
                              onMouseEnter={() => setClearHover(true)}
                              onMouseLeave={() => setClearHover(false)}
                            >
                              <RotateCcw
                                className={cn(
                                  "w-5 h-5",
                                  clearHover && "animate-spin-slow"
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="text-xs">
                            Clear canvas
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                    {!viewOnly && (
                      <div className="absolute right-2 top-6 -translate-y-1/2 z-20 flex flex-col gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleDone}
                              className="p-2 rounded hover:bg-green-200 cursor-pointer animate-slide-right-fade-in"
                            >
                              <Check className="w-5 h-5 text-green-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-xs">
                            Submit
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </TooltipProvider>
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="black"
                    canvasProps={{
                      width: 350,
                      height: 150,
                      className: "w-full h-full",
                      style: {
                        cursor: "crosshair",
                      },
                    }}
                    backgroundColor="transparent"
                    onEnd={handleEnd}
                  />
                </>
              ) : (
                <>
                  {!isHovered && (
                    <>
                      <div className="animate-slide-up-fade-in">
                        <Pen className="h-10 w-10 mb-2 text-gray-400 transition-transform" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center animate-slide-right-fade-in">
                        Click or draw here to sign
                      </p>
                    </>
                  )}
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="black"
                    canvasProps={{
                      width: 350,
                      height: 150,
                      className: cn(
                        "absolute inset-0 w-full h-full",
                        isHovered ? "opacity-100" : "opacity-0"
                      ),
                      style: {
                        cursor: "crosshair",
                      },
                    }}
                    backgroundColor="transparent"
                    onEnd={handleEnd}
                  />
                </>
              )}
            </div>
          )}
          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureUpload;

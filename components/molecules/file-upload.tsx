/**
 * File: components/molecules/file-upload.tsx
 * Description: File upload component with drag and drop support, progress tracking, and preview.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a comprehensive file upload interface, including:
 * - Drag and drop support
 * - Progress tracking
 * - File preview
 * - Multiple file support
 * - Signature upload support
 * - S3 integration
 * - Responsive design
 * - Accessibility features
 */

import { useState, useEffect, useRef } from "react";
import { uploadData, getUrl } from "aws-amplify/storage";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  FileUp,
  Loader2,
  FileCheck,
  FileDown,
  Trash2,
  Hand,
  Grab,
  File,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { uploadFileToS3, getS3FileUrl } from "@/lib/aws-upload";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useLazyQuery } from "@apollo/client";
import { GET_S3_FILE_ADMIN } from "@/lib/graphql/queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * FileUploadProps interface
 *
 * Props for the FileUpload component.
 */
type FileUploadProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUploadComplete?: () => void;
  title?: string;
  limit?: number;
  accept?: string[] | string;
  isSignatureUpload?: boolean;
  ptype?: string;
  userBucket?: string;
  viewOnly?: boolean;
};

/**
 * MultipleFileDisplay Component
 *
 * Displays multiple uploaded files with download and delete options.
 *
 * @param files - Array of file names
 * @param onDownload - Callback when file is downloaded
 * @param onDelete - Callback when file is deleted
 * @param viewOnly - Whether the component is in view-only mode
 */
function MultipleFileDisplay({
  files,
  onDownload,
  onDelete,
  viewOnly,
}: {
  files: string[];
  onDownload: (e: React.MouseEvent, fileName?: string) => void;
  onDelete?: (fileName: string) => void;
  viewOnly?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {files.map((file, index) => {
        const fileName = file.includes("@") ? file.split("@")[0] : file;
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={(e) => onDownload(e, fileName)}
                  >
                    <File className="h-5 w-5 text-blue-600" />
                  </Button>
                  {!viewOnly && onDelete && (
                    <div
                      className="absolute -top-2 -right-2 h-5 w-5 bg-red-100 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(fileName);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{fileName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

/**
 * FileUpload Component
 *
 * Provides a comprehensive file upload interface with drag and drop support.
 *
 * Features:
 * - Drag and drop support
 * - Progress tracking
 * - File preview
 * - Multiple file support
 * - Signature upload support
 * - S3 integration
 * - Responsive design
 * - Accessibility features
 *
 * @param value - Current file value
 * @param onChange - Callback when file changes
 * @param onUploadComplete - Callback when upload completes
 * @param title - Upload title
 * @param limit - Maximum number of files
 * @param accept - Accepted file types
 * @param isSignatureUpload - Whether this is a signature upload
 * @param ptype - Provider type for signature uploads
 * @param viewOnly - Whether the component is in view-only mode
 * @param userBucket - User's S3 bucket
 * @returns {JSX.Element} File upload component
 *
 * @example
 * ```tsx
 * <FileUpload
 *   value={fileUrl}
 *   onChange={handleFileChange}
 *   title="Upload Document"
 *   limit={1}
 *   accept=".pdf,.doc,.docx"
 * />
 * ```
 */
export function FileUpload({
  value,
  onChange,
  onUploadComplete,
  title = "Upload File",
  limit = 1,
  accept,
  isSignatureUpload = false,
  ptype,
  viewOnly = false,
  userBucket,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [showHand, setShowHand] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileLabel = limit === 1 ? "file" : "file(s)";

  const { user } = useUserProfileStore();

  const [getS3AdminURL, { error: s3FileError }] =
    useLazyQuery(GET_S3_FILE_ADMIN);

  // Add handleClick function here
  const handleClick = (e: React.MouseEvent, fileName?: string) => {
    e.stopPropagation();
    handleDownload(fileName);
  };

  // Set up interval for hand/grab icon animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDragging) {
      interval = setInterval(() => {
        setShowHand((prev) => !prev);
      }, 500); // Toggle every 500ms
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDragging]);

  // For signature preview, always get the deterministic URL
  useEffect(() => {
    const fetchPreview = async () => {
      if (isSignatureUpload && ptype && value) {
        const timestamp = Date.now();
        const url = await getS3FileUrl(
          `${ptype}-registration-signature-${timestamp}.png`,
          "private"
        );
        setPreviewUrl(url);
      } else if (value && value.includes("@")) {
        // fallback for non-signature uploads
        setPreviewUrl(null);
      } else {
        setPreviewUrl(null);
      }
    };
    fetchPreview();
  }, [isSignatureUpload, ptype, value]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;
    if ("dataTransfer" in event) {
      files = event.dataTransfer.files;
    } else {
      files = event.target.files;
    }
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files).slice(0, limit);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (isSignatureUpload && ptype) {
        // Handle signature upload
        const file = filesToUpload[0];
        const timestamp = Date.now();
        const uploadedFileName = `${ptype}-registration-signature-${timestamp}.png`;
        const newFile = new Blob([file], { type: file.type });
        const signatureFile = new File([newFile], uploadedFileName, {
          type: file.type,
        });
        await uploadFileToS3(signatureFile, "private", uploadedFileName);
        onChange(uploadedFileName);
      } else if (limit > 1) {
        // Handle multiple file upload
        const uploadedFiles: string[] = [];
        let totalProgress = 0;

        for (const file of filesToUpload) {
          const { url } = await uploadData({
            path: ({ identityId }) => `private/${identityId}/${file.name}`,
            data: file,
            options: {
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  const fileProgress = Math.round(
                    (transferredBytes / totalBytes) * 100
                  );
                  totalProgress =
                    (totalProgress + fileProgress) / filesToUpload.length;
                  setUploadProgress(totalProgress);
                }
              },
            },
          });
          uploadedFiles.push(`${file.name}@private-registration-form.tsx`);
        }

        onChange(uploadedFiles.join(","));
      } else {
        // Handle single file upload
        const file = filesToUpload[0];
        await uploadData({
          path: ({ identityId }) => `private/${identityId}/${file.name}`,
          data: file,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const progress = Math.round(
                  (transferredBytes / totalBytes) * 100
                );
                setUploadProgress(progress);
              }
            },
          },
        });
        onChange(`${file.name}@private-registration-form.tsx`);
      }

      toast.success("File(s) uploaded successfully");
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file(s)");
    }

    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileChange(event);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Modify the handleDownload function to accept a filename parameter
  const handleDownload = async (fileName?: string) => {
    try {
      let url: string;
      const fileToDownload =
        fileName || (value?.includes("@") ? value.split("@")[0] : value);

      if (isSignatureUpload && ptype) {
        // Always use deterministic name and private folder
        url = await getS3FileUrl(
          `${ptype}-registration-signature.png`,
          "private"
        );
      } else if (fileToDownload) {
        // If user has approval permissions and userBucket is provided, use admin function
        if (user?.permissions?.canApproveRegistration && userBucket) {
          const { data } = await getS3AdminURL({
            variables: {
              input: {
                bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                key: `private/${userBucket}/${fileToDownload}`,
              },
            },
          });

          if (s3FileError) {
            throw new Error("Failed to get admin file URL");
          }

          url = data?.signurl?.url;
        } else {
          // Otherwise use regular user function
          const { url: userUrl } = await getUrl({
            path: ({ identityId }) => `private/${identityId}/${fileToDownload}`,
          });
          url = userUrl.toString();
        }
      } else {
        throw new Error("No file to download");
      }

      if (url) {
        window.open(url, "_blank");
      } else {
        throw new Error("No URL available for download");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to get download link");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start w-full max-w-full">
      <Label className="text-sm font-medium pl-2 text-muted-foreground">
        {title}
      </Label>
      <Card className="w-full max-w-sm p-0">
        <CardContent className="p-4">
          {viewOnly && value ? (
            limit > 1 ? (
              <MultipleFileDisplay
                files={value.split(",")}
                onDownload={handleClick}
                viewOnly={viewOnly}
              />
            ) : (
              <div
                className={`flex flex-col items-center justify-center h-32 w-full rounded-md transition-colors select-none relative
                  border-2 border-green-500/20 bg-muted`}
                style={{
                  borderStyle: "solid",
                  borderWidth: "2px",
                  cursor: "pointer",
                }}
                onClick={(e) => handleClick(e)}
                onMouseEnter={() => setIsDownloadHovered(true)}
                onMouseLeave={() => setIsDownloadHovered(false)}
              >
                <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
                  {isDownloadHovered ? (
                    <div className="animate-slide-down-fade-in flex gap-2 flex-col items-center justify-center">
                      <FileDown className="h-10 w-10 animate-bounce text-blue-600" />
                      <p className="text-xs font-medium text-center truncate w-full text-blue-600 cursor-pointer">
                        {`Download ${fileLabel}?`}
                      </p>
                    </div>
                  ) : (
                    <div className="animate-slide-up-fade-in flex gap-2 flex-col items-center justify-center">
                      <FileCheck className="h-10 w-10 text-green-600" />
                      <p className="text-xs font-normal text-center truncate w-full text-green-600">
                        {`Uploaded ${fileLabel}!`}
                      </p>
                    </div>
                  )}
                  <span className="text-sm font-medium text-center truncate w-full max-w-2/3 text-blue-600 underline cursor-pointer">
                    {value.split("@")[0]}
                  </span>
                </div>
              </div>
            )
          ) : isSignatureUpload && previewUrl ? (
            <div
              className={`flex flex-col items-center justify-center h-32 w-full rounded-md transition-colors select-none relative
                border-2 border-green-500/20 bg-muted`}
              style={{
                borderStyle: "solid",
                borderWidth: "2px",
                cursor: "pointer",
              }}
              onClick={(e) => handleClick(e)}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
            >
              <div className="absolute top-2 right-2 z-20">
                {!viewOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                    className="p-2 rounded hover:bg-red-200 cursor-pointer animate-slide-right-fade-in"
                    onMouseEnter={() => setIsDeleteHovered(true)}
                    onMouseLeave={() => setIsDeleteHovered(false)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
                <img
                  src={previewUrl}
                  alt="Signature preview"
                  className="max-h-24 object-contain border rounded bg-white"
                  style={{ maxWidth: "100%" }}
                />
                <span className="text-sm font-medium text-center truncate w-full max-w-2/3 text-blue-600 underline cursor-pointer">
                  {`${ptype}-registration-signature.png`}
                </span>
              </div>
            </div>
          ) : value && value.includes("@") ? (
            limit > 1 ? (
              <MultipleFileDisplay
                files={value.split(",")}
                onDownload={handleClick}
                onDelete={(fileName) => {
                  const newFiles = value
                    .split(",")
                    .filter((f) => f !== fileName);
                  onChange(newFiles.length > 0 ? newFiles.join(",") : null);
                }}
                viewOnly={viewOnly}
              />
            ) : (
              <div
                className={`flex flex-col items-center justify-center h-32 w-full rounded-md transition-colors select-none relative
                  border-2
                  ${
                    isDeleteHovered
                      ? "bg-red-100 border-red-500"
                      : isDownloadHovered
                      ? "border-blue-500"
                      : "border-green-500/20 bg-muted"
                  }`}
                style={{
                  borderStyle: "solid",
                  borderWidth: "2px",
                  cursor: "pointer",
                }}
                onClick={(e) => handleClick(e)}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
              >
                {isCardHovered && !viewOnly && (
                  <div className="absolute top-2 right-2 z-20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(null);
                      }}
                      className="p-2 rounded hover:bg-red-200 cursor-pointer animate-slide-right-fade-in"
                      onMouseEnter={() => setIsDeleteHovered(true)}
                      onMouseLeave={() => setIsDeleteHovered(false)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                )}
                <div
                  className="flex flex-col gap-2 items-center justify-center w-full h-full"
                  onMouseEnter={() => setIsDownloadHovered(true)}
                  onMouseLeave={() => setIsDownloadHovered(false)}
                >
                  {isDeleteHovered ? (
                    <>
                      <div className="animate-slide-left-fade-in flex gap-2 flex-col items-center justify-center">
                        <Trash2 className="h-10 w-10 text-destructive animate-shake-twice" />
                        <p className="text-xs font-medium text-center truncate w-full text-destructive cursor-pointer">
                          {`Delete ${fileLabel}?`}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium text-center truncate w-full max-w-2/3 text-blue-600 underline cursor-pointer`}
                        onClick={(e) => handleClick(e)}
                      >
                        {value.split("@")[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      {isDownloadHovered ? (
                        <div className="animate-slide-down-fade-in flex gap-2 flex-col items-center justify-center">
                          <FileDown className="h-10 w-10 animate-bounce text-blue-600" />
                          <p className="text-xs font-medium text-center truncate w-full text-blue-600 cursor-pointer">
                            {`Download ${fileLabel}?`}
                          </p>
                        </div>
                      ) : (
                        <div className="animate-slide-up-fade-in flex gap-2 flex-col items-center justify-center">
                          <FileCheck className="h-10 w-10 text-green-600" />
                          <p className="text-xs font-normal text-center truncate w-full text-green-600">
                            {`Uploaded ${fileLabel}!`}
                          </p>
                        </div>
                      )}
                      <span
                        className={`text-sm font-medium text-center truncate w-full max-w-2/3 text-blue-600 underline cursor-pointer`}
                        onClick={(e) => handleClick(e)}
                      >
                        {value.split("@")[0]}
                      </span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  multiple={limit > 1}
                  accept={Array.isArray(accept) ? accept.join(",") : accept}
                />
              </div>
            )
          ) : (
            <div
              className={`flex flex-col items-center justify-center border-2 h-32 w-full border-dashed rounded-md p-2 cursor-pointer transition-colors
                ${
                  isDragging || (isHovered && !isUploading)
                    ? "border-blue-500 bg-blue-50"
                    : isUploading
                    ? "border-gray-300 bg-muted"
                    : "border-gray-300 bg-muted"
                }`}
              onClick={!isUploading ? handleButtonClick : undefined}
              onDrop={!isUploading ? handleDrop : undefined}
              onDragOver={!isUploading ? handleDragOver : undefined}
              onDragLeave={!isUploading ? handleDragLeave : undefined}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              role="button"
              tabIndex={0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <Progress value={uploadProgress} className="w-full mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {uploadProgress}%
                  </span>
                </>
              ) : (
                <>
                  <div className="animate-slide-up-fade-in">
                    {isDragging ? (
                      <div className="flex items-center justify-center h-10 w-10 mb-2 relative">
                        <Hand
                          className={cn(
                            "h-10 w-10 text-blue-500 absolute transition-opacity duration-300",
                            showHand ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <Grab
                          className={cn(
                            "h-10 w-10 text-blue-500 absolute transition-opacity duration-300",
                            showHand ? "opacity-0" : "opacity-100"
                          )}
                        />
                      </div>
                    ) : (
                      <FileUp
                        className={`h-10 w-10 mb-2 text-gray-400 transition-transform ${
                          isHovered ? "animate-bounce" : ""
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm text-muted-foreground text-center",
                      isDragging
                        ? "animate-slide-left-fade-in text-blue-500"
                        : isHovered
                        ? "animate-slide-left-fade-in"
                        : "animate-slide-right-fade-in"
                    )}
                  >
                    {isDragging
                      ? "Drop file to upload"
                      : isHovered
                      ? `Upload a ${fileLabel} from your device`
                      : `Click or drop ${fileLabel} here`}
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
                multiple={limit > 1}
                accept={Array.isArray(accept) ? accept.join(",") : accept}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

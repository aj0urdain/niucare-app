/**
 * File: components/molecules/signature-preview-card.tsx
 * Description: Signature preview card component for displaying uploaded signatures.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides signature preview functionality with:
 * - Signature image display
 * - Download support
 * - Delete support
 * - Responsive design
 * - Accessibility features
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2 } from "lucide-react";
import { getS3FileUrl } from "@/lib/aws-upload";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useLazyQuery } from "@apollo/client";
import { GET_S3_FILE_ADMIN } from "@/lib/graphql/queries";

interface SignaturePreviewCardProps {
  filename: string;
  onDelete?: () => void;
  userBucket?: string;
  viewOnly?: boolean;
}

/**
 * SignaturePreviewCard Component
 *
 * Displays a preview of an uploaded signature with download and delete options.
 *
 * Features:
 * - Signature image display
 * - Download support
 * - Delete support
 * - Responsive design
 * - Accessibility features
 *
 * @param {Object} props - Component props
 * @param {string} props.filename - Name of the signature file
 * @param {function} props.onDelete - Function to handle signature deletion
 * @param {string} props.userBucket - Bucket name for admin access
 * @param {boolean} props.viewOnly - Flag to indicate if the card is in view-only mode
 * @returns {JSX.Element} Signature preview card component
 *
 * @example
 * ```tsx
 * <SignaturePreviewCard
 *   filename="signature.png"
 *   onDelete={() => console.log("Delete")}
 *   userBucket="user-bucket-name"
 *   viewOnly={false}
 * />
 * ```
 */
export function SignaturePreviewCard({
  filename,
  onDelete,
  userBucket,
  viewOnly = false,
}: SignaturePreviewCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserProfileStore();

  const [getS3AdminURL, { loading: s3Loading, error: s3FileError }] =
    useLazyQuery(GET_S3_FILE_ADMIN);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchPreview = async () => {
      try {
        let url: string;
        // If user has approval permissions and userBucket is provided, use admin function
        if (user?.permissions?.canApproveRegistration && userBucket) {
          console.log("userBucket", userBucket);
          console.log("filename", filename);

          const fileName = filename.split("@")[0];

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

          console.log("data", data);

          url = data?.signurl?.url;
        } else {
          url = await getS3FileUrl(filename, "private");
        }
        if (mounted) setPreviewUrl(url);
      } catch (error) {
        console.error("Error fetching signature preview:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPreview();

    return () => {
      mounted = false;
    };
  }, [
    filename,
    user?.permissions?.canApproveRegistration,
    userBucket,
    getS3AdminURL,
    s3FileError,
  ]);

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Label className="text-sm font-medium pl-2 text-muted-foreground">
        Signature Uploaded
      </Label>
      <Card className="w-full max-w-md border-2 border-blue-500 bg-blue-50 rounded-md relative p-0">
        <CardContent className="p-4 flex flex-col items-center justify-center h-fit">
          {!viewOnly && (
            <button
              type="button"
              className="absolute top-2 right-2 z-20 p-2 rounded hover:bg-red-200 cursor-pointer animate-slide-right-fade-in"
              onClick={onDelete}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                Loading signature...
              </span>
            </div>
          ) : previewUrl && !s3Loading ? (
            <img
              src={previewUrl}
              alt="Signature preview"
              className="max-h-24 object-contain border rounded bg-white"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <span className="text-xs text-muted-foreground">
              No signature found
            </span>
          )}
          <span className="text-xs text-muted-foreground mt-2 max-w-full text-ellipsis line-clamp-1 whitespace-nowrap">
            {filename}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

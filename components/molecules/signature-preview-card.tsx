import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2 } from "lucide-react";
import { getS3FileUrl } from "@/lib/aws-upload";

interface SignaturePreviewCardProps {
  filename: string;
  onDelete: () => void;
}

export function SignaturePreviewCard({
  filename,
  onDelete,
}: SignaturePreviewCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getS3FileUrl(filename, "private")
      .then((url) => {
        if (mounted) setPreviewUrl(url);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [filename]);

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Label className="text-sm font-medium pl-2 text-muted-foreground">
        Signature Uploaded
      </Label>
      <Card className="w-full max-w-md border-2 border-blue-500 bg-blue-50 rounded-md relative">
        <CardContent className="p-4 flex flex-col items-center justify-center h-32">
          <button
            type="button"
            className="absolute top-2 right-2 z-20 p-2 rounded hover:bg-red-200 cursor-pointer animate-slide-right-fade-in"
            onClick={onDelete}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                Loading signature...
              </span>
            </div>
          ) : previewUrl ? (
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
          <span className="text-xs text-muted-foreground mt-2">{filename}</span>
        </CardContent>
      </Card>
    </div>
  );
}

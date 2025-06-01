/**
 * File: app/(main)/update-policy-holders/page.tsx
 * Description: Policy holders data update page for bulk CSV uploads and management
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { useState } from "react";
import { FileUp, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

/**
 * UpdatePolicyHoldersPage Component
 *
 * Page component for managing policy holder data updates through CSV uploads.
 * Features:
 * - CSV file upload with validation
 * - Upload progress indication
 * - Success/error notifications
 * - Upload history display (placeholder)
 *
 * File Requirements:
 * - Must be CSV format
 * - Contains policy holder information
 *
 * @returns {JSX.Element} The policy holders update page with upload interface
 */
export default function UpdatePolicyHoldersPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles file selection and validates file type
   * @param e - Change event from file input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast.error("Invalid file type", {
        description: "Please select a CSV file",
      });
      e.target.value = "";
    }
  };

  /**
   * Handles file upload process
   * Currently simulates upload with a delay
   * TODO: Implement actual AWS S3 upload
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select a CSV file to upload",
      });
      return;
    }

    setIsUploading(true);

    try {
      // TODO: Implement actual file upload to AWS S3
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated upload delay

      toast.success("Upload successful", {
        description: `${selectedFile.name} has been uploaded successfully`,
        action: {
          label: "View History",
          onClick: () => console.log(""),
        },
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", {
        description:
          "There was an error uploading your file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Upload Policy Holders Data
          </CardTitle>
          <CardDescription>
            Upload a CSV file containing policy holder information to update the
            database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">CSV File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Selected file:</span>
                <span className="font-medium">{selectedFile.name}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Recent policy holder data uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement upload history table */}
          <div className="text-sm text-muted-foreground">No recent uploads</div>
        </CardContent>
      </Card>
    </div>
  );
}

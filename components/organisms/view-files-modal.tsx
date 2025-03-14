"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useFileViewer } from "@/contexts/file-viewer-context";

interface ViewFilesModalProps {
  files?: string[];
  claimId: string;
}

export function ViewFilesModal({ files = [], claimId }: ViewFilesModalProps) {
  const { isOpen, setIsOpen, openFileViewer } = useFileViewer();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          data-view-files="true"
          onClick={() => openFileViewer(files, claimId)}
        >
          <span className="sr-only">View files</span>
          <FileDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Claim Files
          </DialogTitle>
          <DialogDescription>
            View and download files for claim #{claimId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">File {index + 1}</span>
                </div>
                <Button size="sm" variant="outline">
                  Download
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No files available for this claim.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

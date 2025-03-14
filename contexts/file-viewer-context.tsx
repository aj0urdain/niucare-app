import { createContext, useContext, useState } from "react";

interface FileViewerContextType {
  files: string[];
  claimId: string | null;
  isOpen: boolean;
  setFiles: (files: string[]) => void;
  setClaimId: (id: string | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  openFileViewer: (files: string[], claimId: string) => void;
  closeFileViewer: () => void;
}

const FileViewerContext = createContext<FileViewerContextType | undefined>(
  undefined
);

export function FileViewerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<string[]>([]);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openFileViewer = (files: string[], claimId: string) => {
    setFiles(files);
    setClaimId(claimId);
    setIsOpen(true);
  };

  const closeFileViewer = () => {
    setIsOpen(false);
    setFiles([]);
    setClaimId(null);
  };

  return (
    <FileViewerContext.Provider
      value={{
        files,
        claimId,
        isOpen,
        setFiles,
        setClaimId,
        setIsOpen,
        openFileViewer,
        closeFileViewer,
      }}
    >
      {children}
    </FileViewerContext.Provider>
  );
}

export function useFileViewer() {
  const context = useContext(FileViewerContext);
  if (context === undefined) {
    throw new Error("useFileViewer must be used within a FileViewerProvider");
  }
  return context;
}

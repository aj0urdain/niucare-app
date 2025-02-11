import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export function FileUpload({
  onChange,
  accept,
  multiple = false,
}: FileUploadProps) {
  const [fileList, setFileList] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange(files);
    setFileList(files.map((f) => f.name));
  };

  return (
    <div className="grid gap-2">
      <Input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
      />
      {fileList.length > 0 && (
        <ul className="text-sm text-muted-foreground">
          {fileList.map((fileName, index) => (
            <li key={index}>{fileName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

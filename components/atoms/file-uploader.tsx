import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    accept?: string;
}

export function FileUploader({ onFileSelect, accept }: FileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
            // Reset the input so the same file can be selected again
            event.target.value = '';
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={accept}
            />
            <Button 
                onClick={handleClick}
                variant="outline"
                size="sm"
            >
                Add File
            </Button>
        </div>
    );
}
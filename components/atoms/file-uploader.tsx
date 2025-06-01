/**
 * File: components/atoms/file-uploader.tsx
 * Description: Reusable file upload component with custom button trigger
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a customizable file upload interface with a hidden native
 * file input and a styled button trigger. It's designed to be used across the
 * application for consistent file upload experiences while maintaining accessibility.
 */

import { Button } from "@/components/ui/button";
import { useRef } from "react";

/**
 * Props interface for the FileUploader component
 * @property {function} onFileSelect - Callback function called when a file is selected
 * @property {string} [accept] - Optional string specifying allowed file types (e.g., ".pdf,.doc")
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FileUploader
 *   onFileSelect={(file) => console.log('Selected file:', file.name)}
 *   accept=".pdf,.doc,.docx"
 * />
 *
 * // With custom button text
 * <FileUploader
 *   onFileSelect={handleFileSelect}
 *   accept="image/*"
 * >
 *   <Button>Upload Image</Button>
 * </FileUploader>
 * ```
 */
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

/**
 * FileUploader Component
 *
 * A reusable file upload component that provides a custom button trigger
 * for file selection. The actual file input is hidden but accessible.
 *
 * Features:
 * - Custom button trigger
 * - File type filtering
 * - Reset capability for re-selecting same file
 * - Hidden native file input
 * - Accessible file selection
 * - Single file selection
 * - Automatic input reset
 *
 * Usage Guidelines:
 * - Use for single file uploads
 * - Specify accepted file types using the accept prop
 * - Handle file selection in the onFileSelect callback
 * - Consider file size limits in the parent component
 * - Implement error handling for invalid file types
 *
 * Accessibility:
 * - Maintains native file input functionality
 * - Keyboard accessible
 * - Screen reader friendly
 * - Clear visual feedback
 *
 * @param props - Component props
 * @returns {JSX.Element} File upload component with custom button
 *
 * @example
 * ```tsx
 * // Basic implementation
 * function MyComponent() {
 *   const handleFileSelect = (file: File) => {
 *     // Handle the selected file
 *     console.log('File selected:', file.name);
 *   };
 *
 *   return (
 *     <FileUploader
 *       onFileSelect={handleFileSelect}
 *       accept=".pdf,.doc,.docx"
 *     />
 *   );
 * }
 *
 * // With file validation
 * function DocumentUploader() {
 *   const handleFileSelect = (file: File) => {
 *     if (file.size > 5 * 1024 * 1024) { // 5MB limit
 *       alert('File too large');
 *       return;
 *     }
 *     // Process valid file
 *   };
 *
 *   return (
 *     <FileUploader
 *       onFileSelect={handleFileSelect}
 *       accept=".pdf"
 *     />
 *   );
 * }
 * ```
 */
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
      event.target.value = "";
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
      <Button onClick={handleClick} variant="outline" size="sm">
        Add File
      </Button>
    </div>
  );
}

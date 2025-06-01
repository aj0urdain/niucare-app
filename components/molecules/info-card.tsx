/**
 * File: components/molecules/info-card.tsx
 * Description: Information card component for displaying key-value pairs
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides an information card with the following features:
 * - Title display
 * - Key-value pair display
 * - Copy to clipboard functionality
 * - Responsive design
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronsRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * InfoField type definition
 * Represents a single field in the information card
 */
interface InfoField {
  /** The label for the field */
  label: string;
  /** The value of the field */
  value: string | number | null;
}

/**
 * Props for the InfoCard component
 */
interface InfoCardProps {
  /** Optional title for the card */
  title?: string | null;
  /** Array of fields to display */
  fields: InfoField[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * InfoCard Component
 *
 * An information card component that displays key-value pairs with copy functionality.
 *
 * Features:
 * - Title display
 * - Key-value pair display
 * - Copy to clipboard functionality
 * - Responsive design
 * - Grid layout
 * - Toast notifications
 *
 * @param props - Component props
 * @returns {JSX.Element} Information card with key-value pairs
 *
 * @example
 * ```tsx
 * <InfoCard
 *   title="User Information"
 *   fields={[
 *     { label: "Name", value: "John Doe" },
 *     { label: "Email", value: "john@example.com" }
 *   ]}
 * />
 * ```
 */
export function InfoCard({ title, fields, className }: InfoCardProps) {
  const handleCopy = () => {
    const content = fields
      .map((field) => `${field.label}: ${field.value || "Not provided"}`)
      .join("\n");

    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className={`bg-muted pt-4 ${className || ""}`}>
      {title && (
        <CardHeader className="flex h-fit [.border-b]:pb-2 py-0 justify-between items-center">
          <CardTitle className="text-sm text-muted-foreground font-normal flex items-center gap-1">
            <>
              <ChevronsRight className="h-3 w-3" />
              {title}
            </>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardHeader>
      )}
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div key={index}>
              <Label className="text-xs text-muted-foreground">
                {field.label}
              </Label>
              <p className="text-sm font-semibold">
                {field.value || "Not provided"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

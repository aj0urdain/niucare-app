import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronsRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InfoField {
  label: string;
  value: string | number | null;
}

interface InfoCardProps {
  title?: string | null;
  fields: InfoField[];
  className?: string;
}

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

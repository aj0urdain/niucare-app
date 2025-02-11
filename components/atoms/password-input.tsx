import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  showPassword: boolean;
  onVisibilityChange: () => void;
}

export function PasswordInput({
  className,
  showPassword,
  onVisibilityChange,
  ...props
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-0 h-full px-4 py-2 hover:bg-transparent"
              onClick={onVisibilityChange}
            >
              {!showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground/70" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground/70" />
              )}
              <span className="sr-only">
                {!showPassword ? "Show password" : "Hide password"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {!showPassword ? "Show password" : "Hide password"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

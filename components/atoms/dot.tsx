import { cn } from "@/lib/utils";

interface DotProps {
  size?: "tiny" | "small" | "large";
  className?: string;
  animationDelay?: string;
  animationDuration?: string;
}

export const Dot = ({
  size = "small",
  className,
  animationDelay,
  animationDuration,
}: DotProps) => {
  const sizeClasses = {
    tiny: "h-1 w-1",
    small: "h-1.5 w-1.5",
    large: "h-2 w-2",
  };

  const style = {
    animationDelay,
    animationDuration,
  };

  return (
    <div
      className={cn("rounded-full", sizeClasses[size], className)}
      style={style}
    />
  );
};

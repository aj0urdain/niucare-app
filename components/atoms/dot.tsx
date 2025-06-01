/**
 * File: components/atoms/dot.tsx
 * Description: Reusable dot component with customizable size and animation
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a simple dot element that can be used for various UI
 * purposes such as indicators, loading states, or decorative elements. It supports
 * different sizes and animation properties.
 */

import { cn } from "@/lib/utils";

/**
 * DotProps interface
 * Defines the props for the Dot component
 *
 * @property {('tiny'|'small'|'large')} [size='small'] - Size of the dot
 * @property {string} [className] - Additional CSS classes
 * @property {string} [animationDelay] - CSS animation delay
 * @property {string} [animationDuration] - CSS animation duration
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Dot size="small" />
 *
 * // With animation
 * <Dot
 *   size="large"
 *   animationDelay="0.2s"
 *   animationDuration="1s"
 *   className="bg-blue-500"
 * />
 * ```
 */
interface DotProps {
  size?: "tiny" | "small" | "large";
  className?: string;
  animationDelay?: string;
  animationDuration?: string;
}

/**
 * Dot Component
 *
 * A simple dot element that can be used for various UI purposes.
 * Features:
 * - Multiple size options
 * - Customizable styling
 * - Animation support
 * - Responsive design
 *
 * Size Options:
 * - tiny: 4x4 pixels
 * - small: 6x6 pixels
 * - large: 8x8 pixels
 *
 * @param props - Component props
 * @returns {JSX.Element} Rendered dot element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Dot />
 *
 * // With custom styling
 * <Dot
 *   size="large"
 *   className="bg-primary"
 *   animationDelay="0.5s"
 * />
 *
 * // As a loading indicator
 * <div className="flex gap-2">
 *   <Dot size="tiny" className="animate-pulse" />
 *   <Dot size="tiny" className="animate-pulse" animationDelay="0.2s" />
 *   <Dot size="tiny" className="animate-pulse" animationDelay="0.4s" />
 * </div>
 * ```
 */
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

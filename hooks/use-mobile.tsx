/**
 * File: hooks/use-mobile.tsx
 * Description: Hook for detecting mobile viewport using media queries
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { useMediaQuery } from "./use-media-query";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses the useMediaQuery hook internally with a breakpoint of 768px
 *
 * @returns {boolean} True if the viewport width is less than the mobile breakpoint
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile layout
 * }
 * ```
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

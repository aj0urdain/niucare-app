/**
 * File: lib/utils.ts
 * Description: Utility functions for class name merging and Tailwind CSS
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names and resolves Tailwind CSS conflicts
 *
 * @param {...ClassValue[]} inputs - Class names to merge
 * @returns {string} Merged class names string
 *
 * @example
 * ```tsx
 * <div className={cn("px-2 py-1", "bg-red-500", "hover:bg-red-600")}>
 *   Button
 * </div>
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

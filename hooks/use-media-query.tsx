/**
 * File: hooks/use-media-query.tsx
 * Description: Hook for handling media queries in React components
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { useState, useEffect } from "react";

/**
 * Hook to handle media queries in React components
 *
 * @param {string} query - The media query to match against (e.g. "(min-width: 768px)")
 * @returns {boolean} True if the media query matches, false otherwise
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery("(min-width: 768px)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

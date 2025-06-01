/**
 * @file middleware.ts
 * @description Next.js middleware for handling authentication and route protection
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./utils/amplify-utils";

/**
 * Array of paths that don't require authentication
 * @type {string[]}
 */
const publicPaths = [
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/images",
  "/api",
];

/**
 * Next.js middleware function for handling authentication and route protection
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response object
 *
 * @example
 * ```ts
 * // This middleware will:
 * // 1. Allow access to public paths without authentication
 * // 2. Redirect authenticated users away from auth pages
 * // 3. Redirect unauthenticated users to auth pages
 * // 4. Allow access to static files and public assets
 * ```
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  try {
    const authenticated = await isAuthenticated();

    // Only check auth status for auth page to prevent authenticated users from accessing it
    if (pathname === "/auth" && authenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // For non-public paths, require authentication
    if (!isPublicPath && !authenticated) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If there's an error checking authentication and we're not on a public path,
    // redirect to auth
    console.error("Error checking authentication:", error);
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
  }
}

/**
 * Configuration for which routes the middleware should run on
 * Excludes static files, images, and favicon
 * @type {Object}
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

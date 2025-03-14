import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./utils/amplify-utils";

// Define paths that don't require authentication
const publicPaths = [
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/images",
  "/api",
];

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
      return NextResponse.redirect(new URL("/claims", request.url));
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

// Configure which routes to run middleware on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function generateBreadcrumbs(pathname: string) {
  // Remove trailing slash and split into segments
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);

  return segments.map((segment, index) => {
    // Create the URL for this segment by joining all segments up to this point
    const url = `/${segments.slice(0, index + 1).join("/")}`;

    // Capitalize the first letter and replace hyphens with spaces
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return { label, url };
  });
}

export function AppHeader() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(!e.isIntersecting),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xs transition-all duration-200",
        isSticky ? "h-16 border-b shadow-xs" : "h-14"
      )}
    >
      <div className="flex h-full items-center justify-between gap-2 w-full mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          {/* Wrap the trigger in a tooltip */}
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <SidebarTrigger />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Toggle Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-1 h-1 rounded-full bg-muted-foreground mr-2" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-foreground/80"
                >
                  Niucare
                </Link>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.url}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-sm font-medium">
                        {breadcrumb.label}
                      </span>
                    ) : (
                      <Link
                        href={breadcrumb.url}
                        className="text-sm font-medium transition-colors hover:text-foreground/80"
                      >
                        {breadcrumb.label}
                      </Link>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <ThemeSwitcher />
      </div>
    </header>
  );
}

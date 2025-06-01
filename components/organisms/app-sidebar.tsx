/**
 * File: components/organisms/app-sidebar.tsx
 * Description: Main application sidebar component that provides navigation and user interface
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import * as React from "react";
import {
  FileHeart,
  FilePen,
  FileText,
  FileUp,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LifeBuoy,
  Smile,
} from "lucide-react";

import { NavMain } from "@/components/molecules/nav-main";
import { NavUser } from "@/components/molecules/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useUserProfileStore } from "@/stores/user-profile-store";

/**
 * Navigation data structure containing teams and navigation items
 * @property teams - Array of team objects with name, logo, and plan
 * @property navAdmin - Array of admin navigation items
 * @property navServiceProvider - Array of service provider navigation items
 * @property navInfo - Array of informational navigation items
 */
const data = {
  teams: [
    {
      name: "Pacific International",
      logo: Hospital,
      plan: "Hospital",
    },
    {
      name: "Synergy Healthcare",
      logo: HeartPulse,
      plan: "Healthcare",
    },
    {
      name: "Smile Dental",
      logo: Smile,
      plan: "Dental",
    },
  ],
  navAdmin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Registrations",
      url: "/registrations",
      icon: FilePen,
    },
    {
      title: "Claims",
      url: "/claims",
      icon: FileHeart,
    },
    {
      title: "Update Policy Holders",
      url: "/update-policy-holders",
      icon: FileUp,
    },
  ],
  navServiceProvider: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Registration",
      url: "/registration",
      icon: FilePen,
    },
    {
      title: "Claims",
      url: "/claims",
      icon: FileText,
    },
  ],
  navInfo: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
      disabled: true,
    },
  ],
};

/**
 * Loading skeleton component for navigation items
 * @returns {JSX.Element} Skeleton UI for navigation loading state
 */
const NavSkeleton = () => {
  return (
    <div className="space-y-4 px-4 mt-4">
      {/* Title skeleton */}
      <Skeleton className="h-2 w-24" />

      {/* Nav items skeletons */}
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" /> {/* Icon */}
            <Skeleton className="h-4 w-32" /> {/* Text */}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * AppSidebar Component
 *
 * Main sidebar component that provides navigation based on user role and registration status.
 * Displays different navigation items for admin and service provider users.
 *
 * @param {React.ComponentProps<typeof Sidebar>} props - Props passed to the Sidebar component
 * @returns {JSX.Element} The rendered sidebar with appropriate navigation items
 *
 * @example
 * ```tsx
 * <AppSidebar />
 * ```
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUserProfileStore();

  /**
   * Filters service provider navigation items based on registration status
   * @returns {Array} Filtered navigation items for service provider
   */
  const getServiceProviderNav = () => {
    // If registration is acknowledged, show dashboard and claims, hide registration
    if (user?.registration.details?.status === "Acknowledged") {
      return data.navServiceProvider.filter(
        (item) => item.title !== "Registration"
      );
    }

    // If not registered or registration is pending/rejected, show dashboard and registration
    return data.navServiceProvider.filter(
      (item) => item.title === "Registration" || item.title === "Dashboard"
    );
  };

  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#810101]">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0">
          <Image
            src="/images/psna-logo.avif"
            alt="Logo"
            width={100}
            height={100}
            className="w-14 h-auto"
          />
          <h1 className="text-white text-5xl hidden md:block font-bold mt-1.5 group-data-[collapsible=icon]:hidden">
            PSNA
          </h1>
        </div>
        <Separator className="bg-[#dc5555] my-2 mx-auto w-5/6" />
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <>
            <NavSkeleton />
            <div className="mt-6">
              <NavSkeleton />
            </div>
          </>
        ) : (
          <>
            {user?.permissions.canApproveRegistration ? (
              <NavMain title="Admin" items={data.navAdmin} />
            ) : (
              <NavMain
                title="Service Provider"
                items={getServiceProviderNav()}
              />
            )}
            <NavMain title="Support" items={data.navInfo} />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

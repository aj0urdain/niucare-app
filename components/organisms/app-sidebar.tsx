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
import { useUserProfile } from "@/providers/user-profile-manager";

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
      url: "/admin/registrations",
      icon: FilePen,
    },
    {
      title: "Claims",
      url: "/admin/claims",
      icon: FileHeart,
    },
    {
      title: "Update Policy Holders",
      url: "/admin/update-policy-holders",
      icon: FileUp,
    },
  ],
  navServiceProvider: [
    {
      title: "Registration",
      url: "/registration",
      icon: FilePen,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
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

const NavSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <Skeleton className="h-5 w-24 mb-4" />

      {/* Nav items skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" /> {/* Icon */}
            <Skeleton className="h-4 w-32" /> {/* Text */}
          </div>
        ))}
      </div>
    </div>
  );
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUserProfile();

  // Filter service provider nav items based on registration status
  const getServiceProviderNav = () => {
    // If registration is approved or acknowledged, show dashboard and claims, hide registration
    if (
      user?.registration.details?.status === "Acknowledged" ||
      user?.registration.details?.status === "Approved"
    ) {
      return data.navServiceProvider.filter(
        (item) => item.title !== "Registration"
      );
    }

    // If not registered or registration is pending/rejected, only show registration
    return data.navServiceProvider.filter(
      (item) => item.title === "Registration"
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

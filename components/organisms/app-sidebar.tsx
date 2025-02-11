"use client";

import * as React from "react";
import {
  FileHeart,
  FilePen,
  FileText,
  FileUp,
  HeartPulse,
  Hospital,
  Info,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Smile,
} from "lucide-react";

import { NavMain } from "@/components/molecules/nav-main";
import { NavUser } from "@/components/molecules/nav-user";
import { TeamSwitcher } from "@/components/molecules/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import Image from "next/image";

const data = {
  user: {
    name: "Test User",
    email: "test@test.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      title: "About",
      url: "/about",
      icon: Info,
      disabled: true,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: Mail,
      disabled: true,
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
      disabled: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Admin" items={data.navAdmin} />
        <NavMain title="Service Provider" items={data.navServiceProvider} />
        <NavMain title="Support" items={data.navInfo} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

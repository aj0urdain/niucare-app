"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  HeartPulse,
  HelpCircle,
  Hospital,
  Info,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Map,
  PieChart,
  Smile,
} from "lucide-react";

import { NavMain } from "@/components/molecules/nav-main";
import { NavInfo } from "@/components/molecules/nav-info";
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

// This is sample data.
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
  navMain: [
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
        <div className="flex items-center gap-2 px-4 py-4">
          <Image
            src="/images/psna-logo.avif"
            alt="Logo"
            width={100}
            height={100}
            className="w-14 h-auto"
          />
          <h1 className="text-white text-sm font-bold mt-1.5">
            Public Service Niucare Association
          </h1>
        </div>
        <Separator className="bg-[#dc5555] my-2 mx-auto w-5/6" />

        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Platform" items={data.navMain} />
        <NavMain title="Support" items={data.navInfo} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

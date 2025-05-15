"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
export function NavMain({
  items,
  title,
}: {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    disabled?: boolean;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              disabled={item.disabled}
              asChild
              isActive={pathname.startsWith(item.url)}
              className="transition-all duration-150 hover:text-[#810101] data-[active=true]:text-[#810101] data-[active=true]:font-bold"
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

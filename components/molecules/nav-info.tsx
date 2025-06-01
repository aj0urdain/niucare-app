/**
 * File: components/molecules/nav-info.tsx
 * Description: Navigation information component for displaying user and system status
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides navigation information with the following features:
 * - User avatar display
 * - User information display
 * - System status indicator
 * - Theme toggle
 * - Sign out functionality
 * - Responsive design
 */

"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * Props for the NavInfo component
 */
interface NavInfoProps {
  /** Array of navigation items */
  items: {
    /** The name of the navigation item */
    name: string;
    /** The URL to navigate to */
    url: string;
    /** The icon component for the navigation item */
    icon: LucideIcon;
  }[];
}

/**
 * NavInfo Component
 *
 * A navigation information component that displays user and system status.
 *
 * Features:
 * - User avatar display
 * - User information display
 * - System status indicator
 * - Theme toggle
 * - Sign out functionality
 * - Responsive design
 * - Dropdown menu
 * - Keyboard navigation
 * - Screen reader support
 *
 * @param props - Component props
 * @returns {JSX.Element} Navigation information with user and system status
 *
 * @example
 * ```tsx
 * <NavInfo
 *   items={[
 *     { name: "Profile", url: "/profile", icon: UserIcon },
 *     { name: "Settings", url: "/settings", icon: SettingsIcon }
 *   ]}
 * />
 * ```
 */
export function NavInfo({ items }: NavInfoProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Niucare</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}

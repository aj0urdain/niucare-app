/**
 * File: components/molecules/nav-main.tsx
 * Description: Main navigation component for the application
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides the main navigation menu with the following features:
 * - Navigation items with icons
 * - Active state indicators
 * - Disabled state support
 * - Responsive design
 */

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

/**
 * Props for the NavMain component
 */
interface NavMainProps {
  /** The title of the navigation group */
  title: string;
  /** Array of navigation items */
  items: {
    /** The title of the navigation item */
    title: string;
    /** The URL to navigate to */
    url: string;
    /** The icon component for the navigation item */
    icon: LucideIcon;
    /** Whether the item is currently active */
    isActive?: boolean;
    /** Whether the item is disabled */
    disabled?: boolean;
  }[];
}

/**
 * NavMain Component
 *
 * The main navigation component for the application.
 *
 * Features:
 * - Navigation items with icons
 * - Active state indicators
 * - Disabled state support
 * - Responsive design
 * - Path-based active state
 * - Keyboard navigation
 * - Screen reader support
 *
 * @param props - Component props
 * @returns {JSX.Element} Main navigation menu
 *
 * @example
 * ```tsx
 * <NavMain
 *   title="Main Menu"
 *   items={[
 *     { title: "Dashboard", url: "/dashboard", icon: DashboardIcon },
 *     { title: "Profile", url: "/profile", icon: UserIcon }
 *   ]}
 * />
 * ```
 */
export function NavMain({ items, title }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/50">{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              disabled={item.disabled}
              asChild
              isActive={pathname.startsWith(item.url)}
              className="transition-all duration-150 text-white data-[active=true]:text-[#810101] data-[active=true]:font-bold data-[active=true]:bg-white data-[hover=true]:bg-white dark:data-[hover=true]:bg-white"
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

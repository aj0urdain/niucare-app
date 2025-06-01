/**
 * File: components/molecules/admin-nav.tsx
 * Description: Admin navigation component for administrative functions
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides admin navigation with the following features:
 * - Registration management
 * - Claims management
 * - Policy holder updates
 * - Responsive design
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { FileHeart, FilePenLine, FileUp } from "lucide-react";

/**
 * AdminNav Component
 *
 * A navigation component for administrative functions.
 *
 * Features:
 * - Registration management
 * - Claims management
 * - Policy holder updates
 * - Responsive design
 * - Active state indicators
 * - Icon support
 * - Keyboard navigation
 * - Screen reader support
 *
 * @returns {JSX.Element} Admin navigation menu
 *
 * @example
 * ```tsx
 * <AdminNav />
 * ```
 */
export function AdminNav() {
  const pathname = usePathname();

  const items = [
    {
      title: "Registrations",
      href: "/admin/registrations",
      icon: <FilePenLine className="w-4 h-4" />,
    },
    {
      title: "Claims",
      href: "/admin/claims",
      icon: <FileHeart className="w-4 h-4" />,
    },
    {
      title: "Update Policy Holders",
      href: "/admin/update-policy-holders",
      icon: <FileUp className="w-4 h-4" />,
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center gap-2",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.title}
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

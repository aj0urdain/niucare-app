"use client";

import { BadgeCheck, ChevronsUpDown, FileCheck, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useQueryClient } from "@tanstack/react-query";

import { getUrl } from "aws-amplify/storage";
import { useState } from "react";
export function NavUser() {
  const { user } = useUserProfileStore();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleSignOut = async () => {
    try {
      await signOut();
      // Reset the entire query client state
      queryClient.removeQueries();
      queryClient.clear();
      queryClient.resetQueries();
      queryClient.cancelQueries();
      // Force a hard reset of the query client
      queryClient.setQueryData(["userProfile"], null);
      router.push("/auth");
      router.refresh(); // Force a refresh of the router
      toast.success("Signed out successfully");
    } catch (error: unknown) {
      toast.error("Error signing out", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleDownloadCertificate = async () => {
    if (!user?.registration?.id) {
      return;
    }

    setIsLoading(true);
    try {
      const { url } = await getUrl({
        path: ({ identityId }) =>
          `private/${identityId}/${user.registration.id}certificate.pdf`,
        options: {
          expiresIn: 900, // 15 minutes
        },
      });
      const downloadUrl = url.toString();
      setDownloadUrl(downloadUrl);
      // Open the URL in a new tab
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Error getting certificate URL:", error);
      toast.error("Failed to download certificate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="transition-all duration-150 text-white hover:bg-white hover:text-[#810101] data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg bg-muted-foreground dark:bg-muted-foreground">
                <AvatarImage
                  src={user?.avatar ?? ""}
                  alt={user?.given_name ?? ""}
                />
                <AvatarFallback className="rounded-lg text-[#810101] dark:text-white">
                  {user?.given_name?.charAt(0) ?? ""}
                  {user?.family_name?.charAt(0) ?? ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.given_name} {user?.family_name}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatar ?? ""}
                    alt={user?.given_name ?? ""}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.given_name?.charAt(0) ?? ""}
                    {user?.family_name?.charAt(0) ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.given_name} {user?.family_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              {user?.registration?.exists &&
                user?.registration?.status?.toLowerCase() ===
                  "acknowledged" && (
                  <DropdownMenuItem onClick={handleDownloadCertificate}>
                    <FileCheck />
                    Download Provider Certificate
                  </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

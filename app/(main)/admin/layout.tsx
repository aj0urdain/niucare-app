"use client";

import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Extract the last segment of the path and format it
  const title = pathname
    .split("/")
    .pop()
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex justify-between items-start gap-2">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>

      <Separator />
      {children}
    </div>
  );
}

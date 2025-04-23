"use client";

import { useEffect } from "react";
import { useUserProfileStore } from "@/stores/user-profile-store";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useUserProfileStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted p-6">
      <div className="relative w-48 h-auto">
        <Image
          src="/images/psna-logo.avif"
          alt="PSNA Logo"
          className="object-contain"
          priority
          width={400}
          height={400}
        />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-xl font-medium uppercase">
          {isLoading ? "Loading" : "Redirecting"}
        </span>
      </div>
    </div>
  );
}

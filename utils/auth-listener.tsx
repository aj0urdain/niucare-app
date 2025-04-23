"use client";

import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          toast.success("Signed in successfully");
          router.push("/dashboard");
          router.refresh();
          break;
        case "signedOut":
          router.push("/auth");
          router.refresh();
          break;
        case "tokenRefresh":
          router.refresh();
          break;
        case "tokenRefresh_failure":
          toast.error("Session expired");
          router.push("/auth");
          break;
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}

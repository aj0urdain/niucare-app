"use client";

import { redirect } from "next/navigation";

export default function Home() {
  // redirect to claims page
  redirect("/claims");
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}

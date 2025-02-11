import { AppHeader } from "@/components/molecules/app-header";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-auto px-6 flex flex-col h-full w-full items-center justify-center pt-4 2xl:mx-auto">
        <AppHeader />
        <div className="h-full w-full max-w-6xl py-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}

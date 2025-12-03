"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/Footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
        <AppSidebar />
        <SidebarInset className="flex min-h-screen w-full flex-1 flex-col bg-transparent px-4 pt-4 transition-all duration-300 ease-in-out md:px-10">
          <div className="sticky top-2 z-30 mb-4 flex items-center gap-3 pl-1">
            <SidebarTrigger className="rounded-full bg-accent p-2 text-accent-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80" />
            <ThemeToggle />
          </div>
          <div className="flex-1 text-foreground">
            {children}
          </div>
          <div className="-mx-4 mt-4 md:-mx-10">
            <Footer />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-card-foreground">Concurrent Audit Tool</h1>
            </div>
          </header>
          <main className={cn("flex-1 p-6", className)}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar, Header, BottomNav, MobileDrawer } from "@/components/organisms";

interface DashboardShellProps {
  children: React.ReactNode;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    plan?: string;
  };
  className?: string;
}

function DashboardShell({
  children,
  user,
  className,
}: DashboardShellProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = () => {
    router.push("/auth/signout");
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Sidebar
          user={user}
          collapsed={false}
          onSignOut={handleSignOut}
          className="h-full"
        />
      </MobileDrawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          title="ExímIA OS"
          showSearch
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Content Area */}
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            "p-4 lg:p-6",
            "pb-20 lg:pb-6",
            className
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export { DashboardShell };
export type { DashboardShellProps };

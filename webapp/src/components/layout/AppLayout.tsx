import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      {!isMobile ? (
        <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar glass">
          <SidebarNav />
        </aside>
      ) : null}

      {/* Mobile sidebar via Sheet */}
      {isMobile ? (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-3 top-3 z-50 md:hidden h-10 w-10 rounded-lg bg-card/80 backdrop-blur-sm border border-border"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] border-r border-sidebar-border bg-sidebar p-0"
          >
            <SidebarNav onNavClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : null}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div
          key={location.pathname}
          className={cn(
            "min-h-full animate-in fade-in duration-200",
            isMobile ? "pt-14" : ""
          )}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

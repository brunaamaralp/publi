"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { AppSidebar } from "@/components/app/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex min-h-screen bg-fundo-pagina">
      <div className="hidden w-60 shrink-0 lg:block">
        <AppSidebar className="fixed inset-y-0 left-0 z-30 w-60" />
      </div>

      <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
        <SheetContent
          side="left"
          className="w-72 max-w-[85vw] border-r-0 bg-verde-carvao-escuro p-0 text-[#F7F6F2]"
          showCloseButton
        >
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <AppSidebar onNavigate={() => setMenuAberto(false)} className="h-full" />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-cinza-200 bg-fundo-pagina/95 px-4 backdrop-blur lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
          <span className="font-display text-sm font-bold">Publi</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

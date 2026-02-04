"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface SettingsDrawerProps {
  children: React.ReactNode;
}

export function SettingsDrawer({ children }: SettingsDrawerProps) {
  return (
    <div className="lg:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg"
          >
            Open Settings
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="shrink-0 flex flex-row items-center justify-between border-b border-foreground/10 px-6 py-4">
            <DrawerTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/60">
              Wizard Settings
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                Close
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-safe-area-inset-bottom">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

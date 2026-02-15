"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/register-sw";
import { useSettings, updateSettings } from "@/lib/use-cardholder";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.darkMode]);

  return <>{children}</>;
}

export { updateSettings };

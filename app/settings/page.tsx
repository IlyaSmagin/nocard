"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { SettingsScreen } from "@/components/settings-screen";

export default function SettingsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex-1" />}>
        <SettingsScreen />
      </Suspense>
    </AppShell>
  );
}

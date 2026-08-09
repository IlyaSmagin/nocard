"use client";

import { Download, Share, MonitorSmartphone } from "lucide-react";
import { usePwaInstall } from "@/lib/use-pwa-install";

export function PwaInstallSection() {
  const { canPrompt, isStandalone, isIos, installed, promptInstall } =
    usePwaInstall();

  if (isStandalone || installed) return null;

  return (
    <section className="mb-6">
      <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground mb-3">
        App
      </h2>

      {canPrompt ? (
        <button
          onClick={() => promptInstall()}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-card-foreground font-mono text-sm tracking-wider transition-colors active:bg-secondary"
        >
          <Download className="h-5 w-5" />
          Install App
        </button>
      ) : isIos ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 font-mono text-sm tracking-wider text-card-foreground">
            <Share className="h-5 w-5 text-muted-foreground" />
            Install to Home Screen
          </p>
          <ol className="flex flex-col gap-2 font-mono text-xs tracking-wider text-muted-foreground">
            <li>1. Tap the Share button in the browser</li>
            <li>2. Scroll down and tap "Add to Home Screen"</li>
          </ol>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 font-mono text-sm tracking-wider text-card-foreground">
            <MonitorSmartphone className="h-5 w-5 text-muted-foreground" />
            Install as App
          </p>
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            Use the browser menu (⋮ or ☰) and select "Install app" or "Add to
            Home Screen".
          </p>
        </div>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function EmptyHome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-serif text-xl font-bold text-foreground">No cards yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first loyalty card to get started
        </p>
      </div>
      <Link
        href="/settings?add=true"
        className="flex h-14 items-center gap-2 rounded-2xl bg-accent px-8 text-accent-foreground font-mono text-sm tracking-widest uppercase transition-colors active:opacity-80"
      >
        <Plus className="h-5 w-5" />
        Add Card
      </Link>
    </div>
  );
}

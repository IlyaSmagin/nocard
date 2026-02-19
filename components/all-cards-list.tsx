"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCards, useSettings, recordCardUse } from "@/lib/use-cardholder";

export function AllCardsList() {
  const { cards, isLoading } = useCards();
  const { settings } = useSettings();

  const sortedCards = useMemo(() => {
    if (settings.orderLocked) return cards;
    return [...cards].sort((a, b) => b.lastUsed - a.lastUsed);
  }, [cards, settings.orderLocked]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background px-4 pb-4 pt-safe-top">
      {/* Header */}
      <header className="flex items-center gap-4 py-4">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors active:bg-border"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-2xl font-bold text-foreground tracking-tight">
          All Cards
        </h1>
      </header>

      {/* List */}
      <div className="flex flex-col gap-3 flex-1">
        {sortedCards.map((card) => (
          <Link
            key={card.id}
            href={`/card/${card.id}`}
            onClick={() => recordCardUse(card.id)}
            className="flex h-16 items-center gap-4 rounded-2xl border border-border bg-card px-4 text-card-foreground transition-colors active:bg-secondary"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-mono text-sm tracking-wider truncate">
                {card.name}
              </span>
              {card.description && (
                <span className="text-xs text-muted-foreground truncate">
                  {card.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

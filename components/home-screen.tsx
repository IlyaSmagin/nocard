"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Settings, Plus } from "lucide-react";
import { useCards, useSettings, recordCardUse } from "@/lib/use-cardholder";
import { CardTile } from "./card-tile";
import { EmptyHome } from "./empty-home";

export function HomeScreen() {
  const { cards, isLoading } = useCards();
  const { settings } = useSettings();

  const sortedCards = useMemo(() => {
    if (settings.orderLocked) {
      return [...cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return [...cards].sort((a, b) => b.lastUsed - a.lastUsed);
  }, [cards, settings.orderLocked]);

  const displayCards = sortedCards.slice(0, 6);
  const mostRecent = sortedCards[0] ?? null;

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
      <header className="flex items-center justify-between py-4">
        <h1 className="font-serif text-2xl font-bold text-foreground tracking-tight">
          Cardholder
        </h1>
        <Link
          href="/settings"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors active:bg-border"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </header>

      {cards.length === 0 ? (
        <EmptyHome />
      ) : (
        <>
          {/* Add Card Button - Top */}
          <Link
            href="/settings?add=true"
            className="mb-4 flex h-16 w-full items-center justify-center rounded-2xl bg-foreground text-background font-serif text-lg font-bold tracking-wide transition-colors active:opacity-80"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Card
          </Link>

          {/* All Cards Button */}
          <Link
            href="/all-cards"
            className="mb-4 flex h-16 w-full items-center justify-center rounded-2xl border-2 border-foreground bg-background text-foreground font-serif text-lg font-bold tracking-wide transition-colors active:bg-secondary"
          >
            All Cards ({cards.length})
          </Link>

          {/* Card Grid */}
          <div
            className={`grid gap-3 flex-1 ${
              settings.columnCount === 1
                ? "grid-cols-1"
                : "grid-cols-2"
            }`}
            style={{
              gridAutoRows: settings.columnCount === 1 ? "minmax(72px, auto)" : "minmax(96px, auto)",
            }}
          >
            {displayCards.map((card) => (
              <CardTile key={card.id} card={card} onUse={recordCardUse} />
            ))}
          </div>

          {/* Most Recent Quick Button */}
          {mostRecent && (
            <Link
              href={`/card/${mostRecent.id}`}
              onClick={() => recordCardUse(mostRecent.id)}
              className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-accent text-accent-foreground font-mono text-base tracking-widest uppercase transition-colors active:opacity-80"
            >
              {mostRecent.name}
            </Link>
          )}
        </>
      )}
    </main>
  );
}

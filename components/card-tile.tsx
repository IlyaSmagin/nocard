"use client";

import Link from "next/link";
import type { CardData } from "@/lib/db";

interface CardTileProps {
  card: CardData;
  onUse: (id: string) => void;
}

export function CardTile({ card, onUse }: CardTileProps) {
  return (
    <Link
      href={`/card/${card.id}`}
      onClick={() => onUse(card.id)}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-card-foreground transition-colors active:bg-secondary"
    >
      {card.logoDataUrl ? (
        <img
          src={card.logoDataUrl}
          alt={`${card.name} logo`}
          className="h-10 w-10 rounded-lg object-contain"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-serif text-lg font-bold">
          {card.name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-mono text-sm text-center leading-tight tracking-wider truncate w-full">
        {card.name}
      </span>
    </Link>
  );
}

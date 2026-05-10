"use client";

import Link from "next/link";
import type { CardData } from "@/lib/db";
import { CardInitialsBg } from "./card-initials-bg";

interface CardTileProps {
  card: CardData;
  onUse: (id: string) => void;
}

export function CardTile({ card, onUse }: CardTileProps) {
  return (
    <Link
      href={`/card/${card.id}`}
      onClick={() => onUse(card.id)}
      className="CardInitialsContainer relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-card-foreground transition-colors active:bg-secondary overflow-hidden"
    >
      <CardInitialsBg name={card.name} />
      <span className="font-serif text-xl text-center leading-tight tracking-wider truncate w-full relative z-10">
        {card.name}
      </span>
    </Link>
  );
}

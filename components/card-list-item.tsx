"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import type { CardData } from "@/lib/db";

export function CardListItem({
  card,
  index,
  isLocked,
  isMoveUpDisabled,
  isMoveDownDisabled,
  isNewCard,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: {
  card: CardData;
  index: number;
  isLocked: boolean;
  isMoveUpDisabled: boolean;
  isMoveDownDisabled: boolean;
  isNewCard?: boolean;
  onMoveUp: (cardId: string) => void;
  onMoveDown: (cardId: string) => void;
  onEdit: (card: CardData) => void;
  onDelete: (cardId: string) => void;
}) {
  const [shouldAnimate, setShouldAnimate] = useState(isNewCard);

  useEffect(() => {
    if (isNewCard) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isNewCard]);

  return (
    <div
      key={card.id}
      className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground will-change-transform ${
        shouldAnimate ? "card-enter" : "card-reorder"
      } transition-[transform,opacity] duration-250 ease-out`}
      style={{
        transform: shouldAnimate ? "translateZ(0)" : "translateZ(0)",
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-serif text-lg font-bold flex-shrink-0">
        {card.name.slice(0, 2).toUpperCase()}
      </div>
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
      <div className="flex gap-2 flex-shrink-0">
        {isLocked && (
          <>
            <button
              onClick={() => onMoveUp(card.id)}
              disabled={isMoveUpDisabled}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-all duration-150 ease-out active:scale-95 active:bg-border disabled:opacity-30 disabled:cursor-not-allowed will-change-transform"
              aria-label={`Move ${card.name} up`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => onMoveDown(card.id)}
              disabled={isMoveDownDisabled}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-all duration-150 ease-out active:scale-95 active:bg-border disabled:opacity-30 disabled:cursor-not-allowed will-change-transform"
              aria-label={`Move ${card.name} down`}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </>
        )}
        <button
          onClick={() => onEdit(card)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-all duration-150 ease-out active:scale-95 active:bg-border will-change-transform"
          aria-label={`Edit ${card.name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(card.id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-150 ease-out active:scale-95 active:bg-accent/20 will-change-transform"
          aria-label={`Delete ${card.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

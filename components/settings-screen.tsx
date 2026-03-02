"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Camera,
  Upload,
  Moon,
  Sun,
  Columns2,
  Rows3,
  Lock,
  Unlock,
} from "lucide-react";
import {
  useCards,
  useSettings,
  addCard,
  updateCard,
  removeCard,
  reorderCards,
  updateSettings,
} from "@/lib/use-cardholder";
import { CardForm } from "./card-form";
import { CardListItem } from "./card-list-item";
import { SettingsHeader } from "./settings-header";
import type { CardData } from "@/lib/db";

export function SettingsScreen() {
  const { cards } = useCards();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editCard, setEditCard] = useState<CardData | null>(null);
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set());

  // Check for "add" query parameter and open modal
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowAddForm(true);
      setEditCard(null);
    }
  }, [searchParams]);

  // Track newly added cards for animation
  const prevCardCountRef = useRef(cards.length);
  useEffect(() => {
    if (cards.length > prevCardCountRef.current) {
      // A card was added - mark the newly added card as new
      const newCard = cards[cards.length - 1];
      if (newCard) {
        setNewCardIds((prev) => {
          const next = new Set(prev);
          next.add(newCard.id);
          // Clear animation flag after animation completes
          setTimeout(() => {
            setNewCardIds((current) => {
              const updated = new Set(current);
              updated.delete(newCard.id);
              return updated;
            });
          }, 350);
          return next;
        });
      }
    }
    prevCardCountRef.current = cards.length;
  }, [cards.length]);

  // Sort cards by order field for display
  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [cards]
  );

  const handleMoveCard = useCallback(
    async (cardId: string, direction: "up" | "down") => {
      const list = [...sortedCards];
      const fromIndex = list.findIndex((c) => c.id === cardId);
      if (fromIndex === -1) return;

      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= list.length) return;

      // Swap positions
      [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];

      // Single batch write with optimistic UI
      await reorderCards(list);
    },
    [sortedCards]
  );

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
          Settings
        </h1>
      </header>

      {/* Display Settings */}
      <section className="mb-6">
        <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground mb-3">
          Display
        </h2>
        <div className="flex flex-col gap-3">
          {/* Dark Mode */}
          <button
            onClick={() =>
              updateSettings({ ...settings, darkMode: !settings.darkMode })
            }
            className="flex h-14 items-center justify-between rounded-2xl border border-border bg-card px-5 text-card-foreground transition-colors active:bg-secondary"
          >
            <span className="flex items-center gap-3 font-mono text-sm tracking-wider">
              {settings.darkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              Dark Mode
            </span>
            <div
              className={`h-7 w-12 rounded-full p-0.5 transition-colors ${
                settings.darkMode ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full bg-foreground transition-transform ${
                  settings.darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>

          {/* Column Count */}
          <button
            onClick={() =>
              updateSettings({
                ...settings,
                columnCount: settings.columnCount === 1 ? 2 : 1,
              })
            }
            className="flex h-14 items-center justify-between rounded-2xl border border-border bg-card px-5 text-card-foreground transition-colors active:bg-secondary"
          >
            <span className="flex items-center gap-3 font-mono text-sm tracking-wider">
              {settings.columnCount === 2 ? (
                <Columns2 className="h-5 w-5" />
              ) : (
                <Rows3 className="h-5 w-5" />
              )}
              Columns
            </span>
            <span className="font-mono text-sm tracking-wider text-muted-foreground">
              {settings.columnCount}
            </span>
          </button>

          {/* Lock Order */}
          <button
            onClick={() =>
              updateSettings({
                ...settings,
                orderLocked: !settings.orderLocked,
              })
            }
            className="flex h-14 items-center justify-between rounded-2xl border border-border bg-card px-5 text-card-foreground transition-colors active:bg-secondary"
          >
            <span className="flex items-center gap-3 font-mono text-sm tracking-wider">
              {settings.orderLocked ? (
                <Lock className="h-5 w-5" />
              ) : (
                <Unlock className="h-5 w-5" />
              )}
              Lock Order
            </span>
            <div
              className={`h-7 w-12 rounded-full p-0.5 transition-colors ${
                settings.orderLocked ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full bg-foreground transition-transform ${
                  settings.orderLocked ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>
      </section>

      {/* Cards Management */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-sm uppercase tracking-widest text-muted-foreground">
            Cards
          </h2>
          <button
            onClick={() => {
              setEditCard(null);
              setShowAddForm(true);
            }}
            className="flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-accent-foreground font-mono text-xs tracking-widest uppercase transition-colors active:opacity-80"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {sortedCards.length === 0 && !showAddForm && (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground font-mono text-sm tracking-wider">
            No cards added
          </div>
        )}

        <div className="flex flex-col gap-3">
          {sortedCards.map((card, index) => (
            <CardListItem
              key={card.id}
              card={card}
              index={index}
              isLocked={settings.orderLocked}
              isMoveUpDisabled={index === 0}
              isMoveDownDisabled={index === sortedCards.length - 1}
              isNewCard={newCardIds.has(card.id)}
              onMoveUp={(cardId) => handleMoveCard(cardId, "up")}
              onMoveDown={(cardId) => handleMoveCard(cardId, "down")}
              onEdit={(cardToEdit) => {
                setEditCard(cardToEdit);
                setShowAddForm(true);
              }}
              onDelete={(cardId) => {
                if (confirm(`Delete "${sortedCards.find((c) => c.id === cardId)?.name}"?`)) {
                  removeCard(cardId);
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <CardForm
          card={editCard}
          onClose={() => {
            setShowAddForm(false);
            setEditCard(null);
            // Clean up the URL if add parameter was present
            if (searchParams.get("add") === "true") {
              router.replace("/settings", { scroll: false });
            }
          }}
        />
      )}
    </main>
  );
}

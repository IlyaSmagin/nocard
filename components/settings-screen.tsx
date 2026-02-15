"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Camera,
  Upload,
  Trash2,
  Pencil,
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
  updateSettings,
} from "@/lib/use-cardholder";
import type { CardData } from "@/lib/db";

export function SettingsScreen() {
  const { cards } = useCards();
  const { settings } = useSettings();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editCard, setEditCard] = useState<CardData | null>(null);

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

        {cards.length === 0 && !showAddForm && (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground font-mono text-sm tracking-wider">
            No cards added
          </div>
        )}

        <div className="flex flex-col gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground"
            >
              {card.logoDataUrl ? (
                <img
                  src={card.logoDataUrl}
                  alt={`${card.name} logo`}
                  className="h-10 w-10 rounded-lg object-contain flex-shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-serif text-lg font-bold flex-shrink-0">
                  {card.name.charAt(0).toUpperCase()}
                </div>
              )}
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
                <button
                  onClick={() => {
                    setEditCard(card);
                    setShowAddForm(true);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors active:bg-border"
                  aria-label={`Edit ${card.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${card.name}"?`)) {
                      removeCard(card.id);
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors active:bg-accent/20"
                  aria-label={`Delete ${card.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
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
          }}
        />
      )}
    </main>
  );
}

function CardForm({
  card,
  onClose,
}: {
  card: CardData | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(card?.name || "");
  const [description, setDescription] = useState(card?.description || "");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(
    card?.logoDataUrl || null
  );
  const [codeImageDataUrl, setCodeImageDataUrl] = useState<string>(
    card?.codeImageDataUrl || ""
  );
  const [saving, setSaving] = useState(false);
  const codeUploadRef = useRef<HTMLInputElement>(null);
  const codeCameraRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    []
  );

  const handleCodeImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const dataUrl = await readFileAsDataUrl(file);
        setCodeImageDataUrl(dataUrl);
      }
    },
    [readFileAsDataUrl]
  );

  const handleLogoImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const dataUrl = await readFileAsDataUrl(file);
        setLogoDataUrl(dataUrl);
      }
    },
    [readFileAsDataUrl]
  );

  const handleSave = async () => {
    if (!name.trim() || !codeImageDataUrl) return;
    setSaving(true);
    if (card) {
      await updateCard({
        ...card,
        name: name.trim(),
        description: description.trim(),
        logoDataUrl,
        codeImageDataUrl,
      });
    } else {
      await addCard({
        name: name.trim(),
        description: description.trim(),
        logoDataUrl,
        codeImageDataUrl,
      });
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-t-3xl border-t border-border bg-card p-6 pb-8 animate-in slide-in-from-bottom-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-card-foreground">
            {card ? "Edit Card" : "Add Card"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="mb-1 block font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Starbucks"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional note"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Code Image */}
          <div>
            <label className="mb-1 block font-mono text-xs tracking-widest uppercase text-muted-foreground">
              QR / Barcode Image
            </label>
            <input
              ref={codeUploadRef}
              type="file"
              accept="image/*"
              onChange={handleCodeImage}
              className="hidden"
            />
            <input
              ref={codeCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCodeImage}
              className="hidden"
            />
            <div className="flex gap-2">
              <button
                onClick={() => codeUploadRef.current?.click()}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-background font-mono text-xs tracking-wider text-foreground transition-colors active:bg-secondary"
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
              <button
                onClick={() => codeCameraRef.current?.click()}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-background font-mono text-xs tracking-wider text-foreground transition-colors active:bg-secondary"
              >
                <Camera className="h-4 w-4" />
                Camera
              </button>
            </div>
            {codeImageDataUrl && (
              <div className="mt-3 flex items-center justify-center rounded-xl border border-border bg-background p-3">
                <img
                  src={codeImageDataUrl}
                  alt="Code preview"
                  className="max-h-32 object-contain"
                />
              </div>
            )}
          </div>

          {/* Logo Image */}
          <div>
            <label className="mb-1 block font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Logo (optional)
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoImage}
              className="hidden"
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-input bg-background font-mono text-xs tracking-wider text-foreground transition-colors active:bg-secondary"
            >
              <Upload className="h-4 w-4" />
              {logoDataUrl ? "Change Logo" : "Upload Logo"}
            </button>
            {logoDataUrl && (
              <div className="mt-3 flex items-center justify-center">
                <img
                  src={logoDataUrl}
                  alt="Logo preview"
                  className="h-12 w-12 rounded-lg object-contain"
                />
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!name.trim() || !codeImageDataUrl || saving}
            className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-accent text-accent-foreground font-mono text-sm tracking-widest uppercase transition-colors active:opacity-80 disabled:opacity-40"
          >
            {saving ? "Saving..." : card ? "Save Changes" : "Add Card"}
          </button>
        </div>
      </div>
    </div>
  );
}

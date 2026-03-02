"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Camera } from "lucide-react";
import { addCard, updateCard } from "@/lib/use-cardholder";
import type { CardData } from "@/lib/db";

export function CardForm({
  card,
  onClose,
}: {
  card: CardData | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(card?.name || "");
  const [description, setDescription] = useState(card?.description || "");
  const [codeImageDataUrl, setCodeImageDataUrl] = useState<string>(
    card?.codeImageDataUrl || ""
  );
  const [saving, setSaving] = useState(false);
  const codeUploadRef = useRef<HTMLInputElement>(null);
  const codeCameraRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    if (!name.trim() || !codeImageDataUrl) return;
    setSaving(true);
    if (card) {
      await updateCard({
        ...card,
        name: name.trim(),
        description: description.trim(),
        codeImageDataUrl,
      });
    } else {
      await addCard({
        name: name.trim(),
        description: description.trim(),
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

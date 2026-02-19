"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCard, type CardData, touchCard } from "@/lib/db";
import { mutate } from "swr";

interface CardDetailProps {
  cardId: string;
}

export function CardDetail({ cardId }: CardDetailProps) {
  const router = useRouter();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCard(cardId).then((c) => {
      setCard(c ?? null);
      setLoading(false);
      if (c) {
        touchCard(c.id).then(() => mutate("cards"));
      }
    });
  }, [cardId]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="font-serif text-xl text-foreground">Card not found</p>
        <button
          onClick={() => router.back()}
          className="flex h-14 items-center gap-2 rounded-2xl bg-secondary px-8 text-secondary-foreground font-mono text-sm tracking-widest uppercase"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between bg-background px-4 pb-4 pt-safe-top">
      {/* Header */}
      <header className="flex w-full items-center justify-center py-6">
        <h1 className="font-mono text-xl tracking-widest uppercase text-foreground">
          {card.name}
        </h1>
      </header>

      {/* Code Image */}
      <div className="flex flex-1 items-center justify-center w-full">
        <img
          src={card.codeImageDataUrl}
          alt={`${card.name} barcode or QR code`}
          className="w-full h-auto max-h-[70dvh] object-contain px-4"
        />
      </div>

      {/* Description */}
      {card.description && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {card.description}
        </p>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mt-6 flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary-foreground font-mono text-sm tracking-widest uppercase transition-colors active:bg-border"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
    </main>
  );
}

"use client";

import useSWR, { mutate } from "swr";
import {
  getAllCards,
  getSettings,
  saveCard,
  deleteCard,
  touchCard,
  saveSettings,
  generateId,
  type CardData,
  type AppSettings,
} from "./db";

export function useCards() {
  const { data, error, isLoading } = useSWR("cards", getAllCards, {
    fallbackData: [],
  });
  return { cards: data || [], error, isLoading };
}

export function useSettings() {
  const { data, error, isLoading } = useSWR("settings", getSettings, {
    fallbackData: {
      id: "app" as const,
      darkMode: true,
      columnCount: 2 as const,
      orderLocked: false,
    },
  });
  return { settings: data!, error, isLoading };
}

export async function addCard(
  card: Omit<CardData, "id" | "lastUsed" | "createdAt" | "orderLocked" | "order">
) {
  const allCards = await getAllCards();
  const newCard: CardData = {
    ...card,
    id: generateId(),
    lastUsed: Date.now(),
    createdAt: Date.now(),
    orderLocked: false,
    order: allCards.length,
  };
  await saveCard(newCard);
  await mutate("cards");
  return newCard;
}

export async function updateCard(card: CardData) {
  await saveCard(card);
  await mutate("cards");
}

export async function removeCard(id: string) {
  await deleteCard(id);
  await mutate("cards");
}

export async function recordCardUse(id: string) {
  await touchCard(id);
  await mutate("cards");
}

export async function updateSettings(settings: AppSettings) {
  await saveSettings(settings);
  await mutate("settings");
}

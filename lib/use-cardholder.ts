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
  const { data, error, isLoading, mutate: localMutate } = useSWR("cards", getAllCards, {
    fallbackData: [],
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  });
  return { cards: data || [], error, isLoading, mutate: localMutate };
}

export function useSettings() {
  const { data, error, isLoading, mutate: localMutate } = useSWR("settings", getSettings, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
    fallbackData: {
      id: "app" as const,
      darkMode: true,
      columnCount: 2 as const,
      orderLocked: false,
    },
  });
  return { settings: data!, error, isLoading, mutate: localMutate };
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
  await mutate("cards", undefined, { revalidate: true });
  return newCard;
}

export async function updateCard(card: CardData) {
  await saveCard(card);
  await mutate("cards", undefined, { revalidate: true });
}

export async function removeCard(id: string) {
  await deleteCard(id);
  await mutate("cards", undefined, { revalidate: true });
}

export async function recordCardUse(id: string) {
  await touchCard(id);
  await mutate("cards", undefined, { revalidate: true });
}

export async function updateSettings(settings: AppSettings) {
  await saveSettings(settings);
  await mutate("settings", undefined, { revalidate: true });
}

const DB_NAME = "cardholder-db";
const DB_VERSION = 1;
const CARDS_STORE = "cards";
const SETTINGS_STORE = "settings";

export interface CardData {
  id: string;
  name: string;
  description: string;
  codeImageDataUrl: string;
  lastUsed: number;
  createdAt: number;
  orderLocked: boolean;
  order: number;
}

export interface AppSettings {
  id: "app";
  darkMode: boolean;
  columnCount: 1 | 2;
  orderLocked: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  id: "app",
  darkMode: true,
  columnCount: 2,
  orderLocked: false,
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CARDS_STORE)) {
        db.createObjectStore(CARDS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCards(): Promise<CardData[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readonly");
    const store = tx.objectStore(CARDS_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCard(id: string): Promise<CardData | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readonly");
    const store = tx.objectStore(CARDS_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCard(card: CardData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    store.put(card);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteCard(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function touchCard(id: string): Promise<void> {
  const card = await getCard(id);
  if (card) {
    card.lastUsed = Date.now();
    await saveCard(card);
  }
}

export async function getSettings(): Promise<AppSettings> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SETTINGS_STORE, "readonly");
    const store = tx.objectStore(SETTINGS_STORE);
    const req = store.get("app");
    req.onsuccess = () => resolve(req.result || DEFAULT_SETTINGS);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SETTINGS_STORE, "readwrite");
    const store = tx.objectStore(SETTINGS_STORE);
    store.put(settings);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

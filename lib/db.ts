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
  isQrInverted: boolean;
  isQrRotated: boolean;
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

// TODO: Replace PLACEHOLDER_ENCODED_PNG with actual base64-encoded PNG data URLs
//        Format: data:image/png;base64,iVBORw0KGgo...
const SAMPLE_CARDS: Omit<CardData, "lastUsed" | "createdAt">[] = [
  {
    id: "sample-card-1",
    name: "5ka",
    description: "",
    codeImageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmUAAAJlAQMAAAChQRdkAAAABlBMVEX///8AAABVwtN+AAACbklEQVR42u3dQW7CMBBG4UFZZMkROEqPlhytR+EILFkgpsLC/HXHwkIVIY7e26J+yW6U2HGNiGiz7bzSt9nkjy5mo/vZ7OB+tFuTx85oaGhoaGhb0mLH59rVir6Slhvy7e3dT2aHrM32uxENDQ0NDW0hbfR7J5Pm7kkrk6Z5+4qm6YyGhoaGhrZSLfQPTY+b+jGFhoaGhoa2fU1/YI/pjIaGhoaGtm3N1WuaCk+70lTSFBoaGhoa2kJae19NXKMMNbX5fuMDGhoaGhraurVQW4tpAIcVT8taNTQ0NDQ0tJ60nZ4Yq3t+lKj68ykaGhoaGlpfWk7arbm+qpjS75lyr2vFtXdVrbh33RgaGhoaGtqCmtIEbPx+/TsBr+J1+fnpl49oaGhoaGif0FLSlLT2hIyamvIfhD0/B5eWGh4/oqGhoaGhdahpF065S0fUPo/mL2nFG1o0NDQ0NLQONSUtJk1PnLUTULXimQqaTme9r4hKyxQaGhoaGtq7tbhLRwWtNQGLASxttlChzeXZdWhoaGhoaEtoSpqKL1Sbz4BjbTRLU/ryMUxnNDQ0NDS0/jTTI2p1DXL0WuV0RkNDQ0ND618TOLhqaE+aytvTpXSSgLQUGhoaGhraG7X2aXKpoE2NLzWCZvWXwQc0NDQ0NLS1aqqp1c8nb2uazvdGNDQ0NDS0DrX4X6W0DKlL1XfpiEJDQ0NDQ9uKpi6v71OVFt/QhtNZE2VoaGhoaGir0pQ01dTi+17tilU6mw4NDQ0NDe2TmiagNJ1X88KqYtTq31GmBjQ0NDQ0tE61UNbKXa17j2mNEg0NDQ0NrSeNiGiz/QDlzDxC7uTpUwAAAABJRU5ErkJggg==",
    orderLocked: false,
    order: 0,
    isQrInverted: false,
    isQrRotated: false,
  },
  {
    id: "sample-card-2",
    name: "Kahvi",
    description: "& Salaatti",
    codeImageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAp8AAAESAQMAAACB4CzQAAAAAXNSR0IArs4c6QAAAAZQTFRF////AAAAVcLTfgAAAJpJREFUeNrt3LERgzAQRcHPOKAMleLS7NIohRIICRgOxFABEcG+SCOdtoSLJEmSJL2ncRsq+c4Za0/V1G+S+qfVmqH6YblmflOrup7O4aT/Slvy2ZPcM1AoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUOhj1CoQSZIk6WkH6NSUm+aBkR8AAAAASUVORK5CYII=",
    orderLocked: false,
    order: 1,
    isQrInverted: false,
    isQrRotated: false,
  },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CARDS_STORE)) {
        db.createObjectStore(CARDS_STORE, { keyPath: "id" });
        const now = Date.now();
        const store = request.transaction!.objectStore(CARDS_STORE);
        for (const card of SAMPLE_CARDS) {
          store.put({
            ...card,
            lastUsed: now,
            createdAt: now,
          });
        }
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

export async function saveCardsInBatch(cards: CardData[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    for (const card of cards) {
      store.put(card);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function detectIos(): boolean {
  const ua = navigator.userAgent;
  if (/iphone|ipod/i.test(ua)) return true;
  // iPadOS 13+ reports as Mac; distinguish by touch capability
  if (/ipad/i.test(ua)) return true;
  if (/mac/i.test(ua) && navigator.maxTouchPoints > 1) return true;
  return false;
}

function detectStandalone(): boolean {
  const mq =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches;
  if (mq) return true;
  // Legacy iOS Safari
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setIsIos(detectIos());
    setIsStandalone(detectStandalone());

    const mq = window.matchMedia("(display-mode: standalone)");
    const updateStandalone = () => setIsStandalone(detectStandalone());
    mq.addEventListener("change", updateStandalone);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      mq.removeEventListener("change", updateStandalone);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") setInstalled(true);
    return outcome === "accepted";
  }, [deferredPrompt]);

  const canPrompt = deferredPrompt !== null;
  const isInstallable = !isStandalone && !installed;

  return {
    canPrompt,
    isStandalone,
    isIos,
    installed,
    isInstallable,
    promptInstall,
  };
}

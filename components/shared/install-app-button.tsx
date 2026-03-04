"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const mediaStandalone = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;
  const iosStandalone =
    typeof navigator !== "undefined" &&
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  return mediaStandalone || iosStandalone;
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [appInstalled, setAppInstalled] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const installed = isStandaloneMode() || appInstalled;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setAppInstalled(true);
      setDeferredPrompt(null);
      setShowHint(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canPrompt = useMemo(
    () => !installed && Boolean(deferredPrompt),
    [installed, deferredPrompt],
  );

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowHint(true);
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowHint(false);
    }

    setDeferredPrompt(null);
  };

  if (installed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleInstall}
        className="btn-ui btn-dark whitespace-nowrap text-xs sm:text-sm"
      >
        Install Aplikasi
      </button>
      {showHint && !canPrompt ? (
        <p className="rounded-md bg-[#fff8f0] px-3 py-2 text-right text-xs text-[#6d5443] shadow-sm">
          Buka menu browser lalu pilih Install App / Tambahkan ke layar utama.
        </p>
      ) : null}
    </div>
  );
}

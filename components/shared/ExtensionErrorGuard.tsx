"use client";

import { useEffect } from "react";

function isExtensionNoise(value: unknown) {
  const text =
    typeof value === "string"
      ? value
      : value instanceof Error
        ? `${value.message}\n${value.stack ?? ""}`
        : String(value);

  return (
    text.includes("bis_skin_checked") ||
    text.includes("bis_register") ||
    text.includes("chrome-extension://") ||
    text.includes("reading 'M_ID'")
  );
}

export function ExtensionErrorGuard() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (
        event.filename?.startsWith("chrome-extension://") ||
        isExtensionNoise(event.message) ||
        isExtensionNoise(event.error)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("error", onError, true);
    const onReject = (event: PromiseRejectionEvent) => {
      if (isExtensionNoise(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("unhandledrejection", onReject, true);
    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onReject, true);
    };
  }, []);

  return null;
}

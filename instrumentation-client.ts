function isExtensionNoise(value: unknown) {
  const text =
    typeof value === "string"
      ? value
      : value instanceof Error
        ? `${value.message}\n${value.stack ?? ""}`
        : typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : String(value);

  return (
    text.includes("bis_skin_checked") ||
    text.includes("bis_register") ||
    text.includes("chrome-extension://") ||
    text.includes("reading 'M_ID'") ||
    text.includes("eppiocemhmnlbhjplcgkofciiegomcon")
  );
}

function stripBitwardenMarks(root: ParentNode = document) {
  root.querySelectorAll("[bis_skin_checked], [bis_register]").forEach((el) => {
    el.removeAttribute("bis_skin_checked");
    el.removeAttribute("bis_register");
  });
}

const originalError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const blob = args
    .map((arg) =>
      typeof arg === "string"
        ? arg
        : arg instanceof Error
          ? `${arg.message}\n${arg.stack ?? ""}`
          : "",
    )
    .join("\n");
  if (isExtensionNoise(blob) || args.some((arg) => isExtensionNoise(arg))) return;
  originalError(...args);
};

if (typeof window !== "undefined") {
  stripBitwardenMarks();
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        const el = mutation.target as Element;
        el.removeAttribute("bis_skin_checked");
        el.removeAttribute("bis_register");
      }
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          node.removeAttribute("bis_skin_checked");
          node.removeAttribute("bis_register");
          stripBitwardenMarks(node);
        }
      });
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["bis_skin_checked", "bis_register"],
  });

  window.addEventListener(
    "error",
    (event) => {
      if (
        event.filename?.startsWith("chrome-extension://") ||
        isExtensionNoise(event.message) ||
        isExtensionNoise(event.error)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      if (isExtensionNoise(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
}

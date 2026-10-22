"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

/**
 * Markup is identical on the server and the client: both icons are always
 * rendered and CSS decides which one is visible from the `data-theme`
 * attribute. Branching the render on a `mounted` flag would produce different
 * trees on the two sides and is the usual source of hydration mismatches in
 * theme toggles.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sync = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={isDark}
      className={`inline-flex size-10 items-center justify-center border border-rule text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:translate-y-px ${className}`}
    >
      <Sun
        size={16}
        weight="regular"
        aria-hidden="true"
        className="hidden dark:block"
      />
      <Moon
        size={16}
        weight="regular"
        aria-hidden="true"
        className="block dark:hidden"
      />
    </button>
  );
}

"use client";

import { useUi } from "@/lib/i18n";

export default function SkipLink() {
  const { skip } = useUi();
  return (
    <a
      href="#kerja"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-110 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
    >
      {skip}
    </a>
  );
}

"use client";

import { Printer } from "@phosphor-icons/react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-signal hover:text-signal-ink"
    >
      <Printer size={15} weight="regular" aria-hidden="true" />
      Cetak / PDF
    </button>
  );
}

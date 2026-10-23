"use client";

import { Translate } from "@phosphor-icons/react";
import { useLang, type Lang } from "./Lang";

const order: Lang[] = ["id", "en"];

export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const next = order[(order.indexOf(lang) + 1) % order.length];

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={
        lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"
      }
      title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      className={`inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-rule px-2.5 text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:translate-y-px ${className}`}
    >
      <Translate size={16} weight="regular" aria-hidden="true" />
      <span className="readout text-[11px] font-semibold tracking-wider uppercase">
        {lang}
      </span>
    </button>
  );
}

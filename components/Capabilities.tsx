"use client";

import { useRef } from "react";
import {
  BracketsCurly,
  Browser,
  Database,
  GitBranch,
} from "@phosphor-icons/react";
import { capabilities } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const icons = [BracketsCurly, Browser, Database, GitBranch];

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".cap-card").forEach((card, i) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          delay: (i % 2) * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse",
          },
        });
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".cap-card");
      function onMove(this: HTMLElement, e: PointerEvent) {
        const rect = this.getBoundingClientRect();
        this.style.setProperty(
          "--mx",
          `${((e.clientX - rect.left) / rect.width) * 100}%`,
        );
        this.style.setProperty(
          "--my",
          `${((e.clientY - rect.top) / rect.height) * 100}%`,
        );
      }
      cards.forEach((card) => card.addEventListener("pointermove", onMove));
      return () =>
        cards.forEach((card) => card.removeEventListener("pointermove", onMove));
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="keahlian"
      aria-labelledby="keahlian-judul"
      className="mx-auto max-w-[1480px] px-5 pb-24 sm:px-8 sm:pb-32"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-px w-7 bg-signal/60" />
            03 — Keahlian
          </p>
          <h2
            id="keahlian-judul"
            className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            Perkakas
          </h2>
        </div>
        <p className="max-w-[34ch] text-sm leading-relaxed text-ink-soft">
          Alat yang dipakai di proyek nyata. Yang belum pernah dipakai tidak
          masuk daftar ini.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {capabilities.map((cap, i) => {
          const Icon = icons[i % icons.length];
          return (
            <article
              key={cap.title}
              className="cap-card spot-card min-w-0 rounded-2xl border border-rule bg-paper-raised p-6 transition-colors duration-300 hover:border-signal/50 sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 items-center justify-center rounded-xl bg-signal-soft/70 text-signal"
                >
                  <Icon size={20} weight="regular" />
                </span>
                <span className="readout text-[11px] text-ink-mute">
                  {String(cap.items.length).padStart(2, "0")} alat
                </span>
              </div>

              <h3 className="display-tight mt-5 text-3xl text-ink">
                {cap.title}
              </h3>
              <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
                {cap.note}
              </p>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {cap.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-rule bg-paper px-3 py-1.5 text-xs text-ink-soft transition-colors duration-200 hover:border-signal hover:text-signal"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rule bg-paper-deep px-6 py-4 sm:px-8">
        <p className="label text-ink-soft">Bahasa</p>
        <p className="text-sm text-ink">
          Indonesia (asli) · Inggris (profesional)
        </p>
      </div>
    </section>
  );
}

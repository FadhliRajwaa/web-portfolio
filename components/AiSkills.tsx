"use client";

import { useRef } from "react";
import {
  ArrowsSplit,
  PlugsConnected,
  Robot,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useContent } from "@/lib/i18n";
import { useLang, pick } from "./Lang";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const icons = [Robot, PlugsConnected, ArrowsSplit, ShieldCheck];

export default function AiSkills() {
  const { lang } = useLang();
  const { aiSkills } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".ai-skill-card").forEach((card, i) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          delay: (i % 2) * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
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
      const cards = gsap.utils.toArray<HTMLElement>(".ai-skill-card");
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
      id="skill-ai"
      aria-labelledby="skill-ai-judul"
      className="mx-auto max-w-[1480px] px-5 pt-4 pb-24 sm:px-8 sm:pb-32"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="label flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-px w-7 bg-signal/60" />
            04 — {pick(lang, "Skill AI", "AI Skills")}
          </p>
          <h2
            id="skill-ai-judul"
            className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            {pick(lang, "Dikendalikan agen", "Agent-driven")}
          </h2>
        </div>
        <p className="max-w-[34ch] text-sm leading-relaxed text-ink-soft">
          {pick(
            lang,
            "Perkakas AI yang dipakai tiap hari, dengan bukti dari repo ini — bukan klaim generik.",
            "AI tools used every day, with proof from this repo — not generic claims.",
          )}
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {aiSkills.map((skill, i) => {
          const Icon = icons[i % icons.length];
          return (
            <article
              key={skill.id}
              className="ai-skill-card spot-card min-w-0 rounded-2xl border border-rule bg-paper-raised p-5 pb-6 transition-colors duration-300 hover:border-signal/50 sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 items-center justify-center rounded-xl bg-signal-soft/70 text-signal"
                >
                  <Icon size={20} weight="regular" />
                </span>
                <span className="readout text-[11px] text-ink-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="display-tight mt-5 text-3xl text-ink">
                {skill.name}
              </h3>
              <p className="label mt-2 text-signal">{skill.role}</p>
              <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
                {skill.example}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

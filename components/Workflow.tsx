"use client";

import { useRef } from "react";
import { useContent } from "@/lib/i18n";
import { useLang, pick } from "./Lang";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Workflow() {
  const { lang } = useLang();
  const { workflowSteps } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".workflow-step").forEach((step, i) => {
        gsap.from(step, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          delay: (i % 2) * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
        });
      });
      const mm = gsap.matchMedia();
      // Desktop: rail horizontal (scaleX). Mobile: rail vertikal (scaleY).
      // Satu rail aktif dalam satu waktu — bukan dua ScrollTrigger yang berebut.
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".workflow-rail-fill",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".workflow-track",
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".workflow-rail-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".workflow-track",
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="cara-kerja"
      aria-labelledby="cara-kerja-judul"
      className="mx-auto max-w-[1480px] px-5 pt-4 pb-24 sm:px-8 sm:pb-32"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="label flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-px w-7 bg-signal/60" />
            05 — {pick(lang, "Cara Kerja", "Workflow")}
          </p>
          <h2
            id="cara-kerja-judul"
            className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            {pick(lang, "Dari brief sampai rilis", "From brief to ship")}
          </h2>
        </div>
        <p className="max-w-[34ch] text-sm leading-relaxed text-ink-soft">
          {pick(
            lang,
            "Alur yang sama untuk setiap perubahan di situs ini.",
            "The same pipeline behind every change on this site.",
          )}
        </p>
      </div>

      <div className="workflow-track relative mt-10">
        {/* Rail: vertikal di mobile (kiri), horizontal di desktop (bawah kartu,
            tepat di pusat lingkaran nomor). */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[27px] w-px bg-rule lg:hidden"
        >
          <div className="workflow-rail-fill h-full w-full origin-top bg-signal" />
        </div>

        <ol className="relative grid gap-4 pl-14 lg:grid-cols-4 lg:gap-5 lg:pl-0 lg:pt-0 lg:pb-14">
          {/* Rail desktop: pusat lingkaran = 28px di bawah kartu
              (-bottom-14 + setengah size-14). */}
          <div
            aria-hidden="true"
            className="absolute right-0 bottom-[28px] left-0 hidden h-px bg-rule lg:block"
          >
            <div className="workflow-rail-fill h-full w-full origin-left bg-signal" />
          </div>
          {workflowSteps.map((step, i) => (
            <li
              key={step.id}
              className="workflow-step relative min-w-0 rounded-2xl border border-rule bg-paper-raised p-5 pb-6 sm:p-7"
            >
              <span
                aria-hidden="true"
                className="absolute top-1/2 -left-14 flex size-14 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-paper text-signal lg:top-auto lg:-bottom-14 lg:left-7 lg:translate-y-0"
              >
                <span className="readout text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <h3 className="display-tight text-2xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {step.body}
              </p>
              <p className="mt-4">
                <code className="readout inline-block rounded-full border border-rule bg-paper-deep px-3 py-1.5 text-[11px] text-ink-soft">
                  {step.artifact}
                </code>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

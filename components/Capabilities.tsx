"use client";

import { useRef } from "react";
import { capabilities } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Replays on every re-entry, in both scroll directions.
      gsap.from(".cap-group", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cap-list",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="keahlian"
      aria-labelledby="keahlian-judul"
      className="mx-auto max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2
            id="keahlian-judul"
            className="display text-[clamp(2.5rem,5.5vw,4.25rem)]"
          >
            Keahlian
          </h2>
          <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-ink-soft">
            Alat yang dipakai di proyek nyata. Yang belum pernah dipakai tidak
            masuk daftar ini.
          </p>

          <div className="mt-10 border-t border-rule">
            <div className="border-b border-rule py-3">
              <p className="label text-ink-mute">Bahasa</p>
              <p className="mt-1.5 text-sm text-ink">
                Indonesia (asli), Inggris (profesional)
              </p>
            </div>
            <div className="border-b border-rule py-3">
              <p className="label text-ink-mute">Cakupan</p>
              <p className="mt-1.5 text-sm text-ink">
                Basis data, API, antarmuka, rilis
              </p>
            </div>
          </div>
        </div>

        <div className="cap-list">
          {capabilities.map((cap) => (
            <article
              key={cap.title}
              className="cap-group grid gap-x-8 gap-y-4 border-t border-rule py-7 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr]"
            >
              <div>
                <h3 className="display-tight text-2xl">{cap.title}</h3>
                <p className="readout mt-1.5 text-[11px] text-ink-mute">
                  {String(cap.items.length).padStart(2, "0")} alat
                </p>
              </div>

              <div>
                <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-soft">
                  {cap.note}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {cap.items.map((item) => (
                    <li
                      key={item}
                      className="border border-rule px-2.5 py-1.5 text-xs text-ink transition-colors duration-200 hover:border-rule-strong hover:bg-paper-raised"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

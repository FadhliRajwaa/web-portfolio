"use client";

import { useRef } from "react";
import { experience, certifications } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Replays on every re-entry: forward when the list enters from below,
      // reverse when it leaves past the bottom, forward again on the way back.
      // `once: true` would play it a single time for the whole visit.
      gsap.from(".exp-entry", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-list",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
        },
      });

      // The rail fills as the list is read, showing progress through time.
      gsap.fromTo(
        ".exp-rail-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".exp-list",
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.4,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="pengalaman"
      aria-labelledby="pengalaman-judul"
      className="border-y border-rule bg-paper-deep"
    >
      <div className="mx-auto max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[0.4fr_0.6fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2
              id="pengalaman-judul"
              className="display text-[clamp(2.5rem,5.5vw,4.25rem)]"
            >
              Pengalaman
            </h2>
            <p className="mt-6 max-w-[36ch] text-base leading-relaxed text-ink-soft">
              Tiga tahun terakhir berpindah antara tim perbankan dan proyek
              mandiri. Keduanya menuntut hal yang sama: sistem yang bisa
              dipercaya saat datanya salah.
            </p>

            <dl className="mt-10 hidden border-t border-rule-strong lg:block">
              <div className="flex items-baseline justify-between gap-4 border-b border-rule-strong py-3">
                <dt className="label text-ink-mute">Basis</dt>
                <dd className="text-sm text-ink">Semarang, remote</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-rule-strong py-3">
                <dt className="label text-ink-mute">Fokus</dt>
                <dd className="text-sm text-ink">Backend dan full stack</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-rule-strong py-3">
                <dt className="label text-ink-mute">Pendidikan</dt>
                <dd className="max-w-[20ch] text-right text-sm text-ink">
                  S1 Teknik Informatika, UNISBANK
                </dd>
              </div>
            </dl>
          </div>

          <div className="exp-list relative">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-0 w-px bg-rule-strong/45"
            />
            <div
              aria-hidden="true"
              className="exp-rail-fill absolute top-2 bottom-2 left-0 w-px origin-top bg-signal"
            />

            <ol>
              {experience.map((job) => (
                <li key={job.company} className="exp-entry relative pb-11 pl-7 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 -left-[3.5px] size-2 rounded-full ${
                      job.current ? "bg-signal" : "border border-signal bg-paper-deep"
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="readout text-[11px] text-signal">
                      {job.period}
                    </span>
                    <span className="label text-ink-mute">{job.location}</span>
                  </div>

                  <h3 className="display-tight mt-2.5 text-[1.9rem] sm:text-[2.35rem]">
                    {job.role}
                  </h3>
                  <p className="mt-1 text-[0.95rem] text-ink-soft">
                    {job.company}
                  </p>

                  <p className="mt-3 max-w-[56ch] text-[0.95rem] leading-relaxed text-ink-soft">
                    {job.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {job.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-[0.95rem] leading-relaxed text-ink"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.6em] h-px w-3 shrink-0 bg-rule-strong"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16 border-t border-rule-strong pt-8">
          <h3 className="label text-ink-mute">Sertifikasi</h3>
          <ul className="mt-4 grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {certifications.map((cert) => (
              <li
                key={cert.name}
                className="flex items-baseline justify-between gap-4 border-b border-rule py-3"
              >
                <span className="text-sm text-ink">{cert.name}</span>
                <span className="readout shrink-0 text-[11px] text-ink-mute">
                  {cert.score ? `${cert.score} · ` : ""}
                  {cert.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

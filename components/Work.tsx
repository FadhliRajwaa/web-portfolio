"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Lock, Plus, X } from "@phosphor-icons/react";
import { projects, type Project } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

function Gallery({ shots, name }: { shots: Project["shots"]; name: string }) {
  const [index, setIndex] = useState(0);
  if (!shots.length) return null;
  const shot = shots[index];

  return (
    <div>
      <div className="relative overflow-hidden border border-instrument-rule bg-instrument-2">
        <div className="relative aspect-[16/10] w-full">
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-6">
        <p className="max-w-[52ch] text-sm leading-relaxed text-instrument-mute">
          {shot.caption}
        </p>
        {shots.length > 1 ? (
          <div
            role="tablist"
            aria-label={`Tangkapan layar ${name}`}
            className="flex shrink-0 gap-1.5"
          >
            {shots.map((s, i) => (
              <button
                key={s.src}
                role="tab"
                aria-selected={i === index}
                aria-label={`Tangkapan ${i + 1}: ${s.caption}`}
                onClick={() => setIndex(i)}
                className={`h-9 w-14 overflow-hidden border transition-colors ${
                  i === index
                    ? "border-[#8fb0ff]"
                    : "border-instrument-rule opacity-55 hover:opacity-100"
                }`}
              >
                <Image
                  src={s.src}
                  alt=""
                  width={112}
                  height={72}
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Detail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(panel.current, {
        y: 26,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    },
    { scope: panel },
  );

  // Focus management is a plain effect concern, not an animation one.
  useGSAP(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previous?.focus();
    };
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`detail-${project.slug}`}
      className="fixed inset-0 z-90 flex items-end justify-center sm:items-center sm:p-6"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#05080a]/80 backdrop-blur-[2px]"
      />

      <div
        ref={panel}
        className="relative max-h-[93dvh] w-full max-w-5xl overflow-y-auto bg-instrument text-instrument-ink sm:max-h-[90dvh]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-instrument-rule bg-instrument px-5 py-3.5 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="readout text-xs text-[#8fb0ff]">
              {project.index}
            </span>
            <span className="label text-instrument-mute">
              {project.category}
            </span>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Tutup detail proyek"
            className="inline-flex size-9 items-center justify-center border border-instrument-rule text-instrument-ink transition-colors hover:border-instrument-ink"
          >
            <X size={15} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-8 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div>
            <h3
              id={`detail-${project.slug}`}
              className="display text-4xl sm:text-5xl"
            >
              {project.name}
            </h3>
            <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-instrument-mute">
              {project.tagline}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-instrument-rule pt-5">
              <div>
                <dt className="label text-instrument-mute">Peran</dt>
                <dd className="mt-1 text-sm">{project.role}</dd>
              </div>
              <div>
                <dt className="label text-instrument-mute">Periode</dt>
                <dd className="readout mt-1 text-sm">{project.period}</dd>
              </div>
            </dl>

            <div className="mt-7">
              <h4 className="label text-[#8fb0ff]">Masalah</h4>
              <p className="mt-2.5 max-w-[52ch] text-sm leading-relaxed text-instrument-ink/85">
                {project.problem}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="label text-[#8fb0ff]">Yang dibangun</h4>
              <ul className="mt-2.5 divide-y divide-instrument-rule border-t border-instrument-rule">
                {project.built.map((item, i) => (
                  <li key={item} className="flex gap-3 py-3">
                    <span className="readout shrink-0 pt-0.5 text-[11px] text-instrument-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-instrument-rule pt-5">
              <h4 className="label text-[#8fb0ff]">Hasil</h4>
              <p className="mt-2.5 max-w-[52ch] text-sm leading-relaxed text-instrument-ink/85">
                {project.outcome}
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-instrument-rule px-2.5 py-1 text-[11px] text-instrument-mute"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-6 inline-flex items-center gap-2 border border-instrument-rule px-4 py-2.5 text-sm text-instrument-ink transition-colors hover:border-[#8fb0ff] hover:text-[#8fb0ff]"
              >
                Buka situs
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ) : null}
          </div>

          <div>
            {project.shots.length ? (
              <Gallery shots={project.shots} name={project.name} />
            ) : (
              <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 border border-instrument-rule bg-instrument-2 px-6 text-center">
                <Lock size={22} weight="regular" aria-hidden="true" className="text-instrument-mute" />
                <p className="text-sm text-instrument-mute">
                  Tampilan tidak dapat ditampilkan karena perjanjian
                  kerahasiaan dengan klien.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState<Project | null>(null);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Each row replays when it re-enters the viewport, in either direction.
      gsap.utils.toArray<HTMLElement>(".project-row").forEach((row) => {
        gsap.from(row, {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
            end: "bottom 8%",
            toggleActions: "play reverse play reverse",
          },
        });
      });
    },
    { scope: root },
  );

  // A jump in scroll position (deep link, restored scroll) must not leave
  // rows invisible; the trigger is refreshed once fonts and images settle.
  useGSAP(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(id);
  });

  return (
    <section
      ref={root}
      id="kerja"
      aria-labelledby="kerja-judul"
      className="mx-auto max-w-[1480px] px-5 pt-24 pb-24 sm:px-8 sm:pt-32"
    >
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-rule pb-5">
        <h2
          id="kerja-judul"
          className="display text-[clamp(2.5rem,6vw,4.75rem)]"
        >
          Proyek
        </h2>
        <p className="readout text-xs text-ink-mute">
          {String(projects.length).padStart(2, "0")} sistem, 2025-2026
        </p>
      </div>

      <ul>
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-rule">
            <button
              type="button"
              onClick={() => setActive(project)}
              aria-haspopup="dialog"
              className="project-row group relative grid w-full grid-cols-[1fr_auto] items-start gap-x-5 gap-y-3 py-7 text-left sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:py-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-3 -right-3 -z-10 origin-bottom scale-y-0 bg-paper-raised transition-transform duration-300 ease-[var(--ease-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />

              <span className="readout hidden text-xs text-ink-mute sm:block">
                {project.index}
              </span>

              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="display-tight text-[1.75rem] transition-colors duration-300 group-hover:text-signal sm:text-4xl">
                    {project.name}
                  </span>
                  <span className="label text-ink-mute">
                    {project.category}
                  </span>
                  {project.confidential ? (
                    <span className="label inline-flex items-center gap-1.5 border border-rule px-2 py-1 text-ink-mute">
                      <Lock size={10} weight="bold" aria-hidden="true" />
                      NDA
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block max-w-[64ch] text-sm leading-relaxed text-ink-soft">
                  {project.tagline}
                </span>
                <span className="readout mt-2.5 block text-[11px] text-ink-mute sm:hidden">
                  {project.period}
                </span>
              </span>

              <span className="flex items-center gap-5 sm:justify-end">
                <span className="readout hidden text-[11px] text-ink-mute sm:inline">
                  {project.period}
                </span>
                <span className="inline-flex size-10 shrink-0 items-center justify-center border border-rule text-ink transition-colors duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-signal-ink">
                  <Plus size={15} weight="bold" aria-hidden="true" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? <Detail project={active} onClose={() => setActive(null)} /> : null}
    </section>
  );
}

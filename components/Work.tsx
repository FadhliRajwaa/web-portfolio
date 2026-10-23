"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Lock, Minus, Plus } from "@phosphor-icons/react";
import { projects, type Project } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

function Gallery({ shots, name }: { shots: Project["shots"]; name: string }) {
  const [index, setIndex] = useState(0);
  if (!shots.length) return null;
  const shot = shots[index];

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-rule bg-paper-deep">
        <div className="relative aspect-[16/10] w-full">
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-[52ch] text-sm leading-relaxed text-ink-mute">
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
                className={`h-11 w-[4.25rem] overflow-hidden rounded-md border transition-all duration-200 ${
                  i === index
                    ? "border-signal ring-1 ring-signal"
                    : "border-rule opacity-55 hover:opacity-100"
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

function ProjectCard({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  const btnId = `proyek-btn-${project.slug}`;
  const panelId = `proyek-panel-${project.slug}`;

  return (
    <article className="project-row overflow-hidden rounded-2xl border border-rule bg-paper-raised transition-colors duration-300 has-[button[aria-expanded='true']]:border-signal/60">
      {/* Header row: always visible, toggles the detail below. */}
      <button
        id={btnId}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-5 gap-y-3 px-5 py-5 text-left sm:px-8 sm:py-6 lg:grid-cols-[3.5rem_1fr_auto] lg:gap-x-6"
      >
        <span className="readout hidden text-xs text-ink-mute lg:block">
          {project.index}
        </span>

        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="display-tight text-2xl text-ink transition-colors duration-300 group-hover:text-signal sm:text-4xl">
              {project.name}
            </span>
            <span className="readout rounded-full border border-rule bg-paper-deep px-2.5 py-1 text-[10px] tracking-[0.08em] text-ink-soft uppercase">
              {project.category}
            </span>
            {project.confidential ? (
              <span className="readout inline-flex items-center gap-1.5 rounded-full border border-rule px-2.5 py-1 text-[10px] text-ink-mute">
                <Lock size={10} weight="bold" aria-hidden="true" />
                NDA
              </span>
            ) : null}
          </span>
          <span className="mt-1.5 block max-w-[64ch] text-sm leading-relaxed text-ink-soft">
            {project.tagline}
          </span>
        </span>

        <span className="flex items-center gap-4 lg:gap-5">
          <span className="readout hidden text-[11px] text-ink-mute md:inline">
            {project.period}
          </span>
          <span
            aria-hidden="true"
            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open
                ? "rotate-180 border-signal bg-signal text-signal-ink"
                : "border-rule text-ink group-hover:border-signal group-hover:bg-signal group-hover:text-signal-ink"
            }`}
          >
            {open ? (
              <Minus size={15} weight="bold" />
            ) : (
              <Plus size={15} weight="bold" />
            )}
          </span>
        </span>
      </button>

      {/* Detail: inline expansion, the page grows, nothing is hidden in a modal. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        data-open={open}
        className="expand-grid"
      >
        <div className="expand-inner">
          <div className="grid gap-8 border-t border-rule px-5 py-7 sm:px-8 sm:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="min-w-0">
              <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <dt className="label text-ink-mute">Peran</dt>
                  <dd className="mt-1 text-sm text-ink">{project.role}</dd>
                </div>
                <div>
                  <dt className="label text-ink-mute">Periode</dt>
                  <dd className="readout mt-1 text-sm text-ink">
                    {project.period}
                  </dd>
                </div>
              </dl>

              <p className="mt-5 max-w-[56ch] text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
                {project.summary}
              </p>

              <h4 className="label mt-6 text-signal">Masalah</h4>
              <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-ink-soft">
                {project.problem}
              </p>

              <h4 className="label mt-6 text-signal">Yang dibangun</h4>
              <ul className="mt-2 divide-y divide-rule border-t border-rule">
                {project.built.map((item, i) => (
                  <li key={item} className="flex gap-3 py-2.5">
                    <span className="readout shrink-0 pt-0.5 text-[11px] text-ink-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-ink">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl bg-signal-soft/60 px-4 py-3.5">
                <h4 className="label text-signal">Hasil</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                  {project.outcome}
                </p>
              </div>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-rule bg-paper px-3 py-1 text-[11px] text-ink-soft transition-colors hover:border-signal hover:text-signal"
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
                  className="group mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal hover:text-signal-ink"
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

            <div className="min-w-0">
              {project.shots.length ? (
                <Gallery shots={project.shots} name={project.name} />
              ) : (
                <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-rule-strong bg-paper-deep px-6 text-center">
                  <Lock
                    size={22}
                    weight="regular"
                    aria-hidden="true"
                    className="text-ink-mute"
                  />
                  <p className="max-w-[38ch] text-sm text-ink-mute">
                    Tampilan tidak dapat ditampilkan karena perjanjian
                    kerahasiaan dengan klien.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(projects[0]?.slug ?? null);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".project-row").forEach((row) => {
        gsap.from(row, {
          y: 28,
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

  useGSAP(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(id);
  });

  return (
    <section
      ref={root}
      id="kerja"
      aria-labelledby="kerja-judul"
      className="mx-auto max-w-[1480px] px-5 pt-20 pb-24 sm:px-8 sm:pt-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="label flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-px w-7 bg-signal/60" />
            01 — Proyek
          </p>
          <h2
            id="kerja-judul"
            className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            Indeks kerja
          </h2>
        </div>
        <p className="readout max-w-[26ch] text-left text-[11px] leading-relaxed text-ink-mute sm:text-right">
          {String(projects.length).padStart(2, "0")} sistem · 2025—2026 · klik
          untuk membuka berkas
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            open={openSlug === project.slug}
            onToggle={() =>
              setOpenSlug((s) => (s === project.slug ? null : project.slug))
            }
          />
        ))}
      </div>
    </section>
  );
}

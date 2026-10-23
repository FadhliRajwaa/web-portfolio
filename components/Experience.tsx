"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Certificate,
} from "@phosphor-icons/react";
import { profile } from "@/lib/content";
import { useContent } from "@/lib/i18n";
import { useLang, pick } from "./Lang";

const meta = [
  { label: "Basis", value: "Semarang, remote" },
  { label: "Fokus", value: "Backend dan full stack" },
  { label: "Pendidikan", value: "S1 Teknik Informatika, UNISBANK" },
];

const metaEn = [
  { label: "Based", value: "Semarang, remote" },
  { label: "Focus", value: "Backend and full stack" },
  { label: "Education", value: "BSc Informatics, UNISBANK" },
];

const certs = [
  {
    name: "Secure Software Development Life Cycle",
    issuer: "PT Skyworx Indonesia",
    year: "2026",
  },
  {
    name: "API Automation Using Postman — 90/100",
    issuer: "PT Skyworx Indonesia",
    year: "2026",
  },
  {
    name: "Coding Camp Front-End & Back-End — 910 jam",
    issuer: "Dicoding × DBS Foundation",
    year: "2025",
  },
  {
    name: "English for Business Communication — 82%",
    issuer: "The British Institute",
    year: "2025",
  },
];

const certsEn = [
  {
    name: "Secure Software Development Life Cycle",
    issuer: "PT Skyworx Indonesia",
    year: "2026",
  },
  {
    name: "API Automation Using Postman — 90/100",
    issuer: "PT Skyworx Indonesia",
    year: "2026",
  },
  {
    name: "Coding Camp Front-End & Back-End — 910 hours",
    issuer: "Dicoding × DBS Foundation",
    year: "2025",
  },
  {
    name: "English for Business Communication — 82%",
    issuer: "The British Institute",
    year: "2025",
  },
];

type Flow = {
  period: string;
  role: string;
  company: string;
  location: string;
  points: string[];
  current?: boolean;
};

const flows: Flow[] = [
  {
    period: "Apr — Okt 2026",
    role: "Backend Developer (.NET)",
    company: "PT Intikom Berlian Mustika",
    location: "Penempatan di PT Skyworx · SAMCO",
    current: true,
    points: [
      "43 modul parameter master data — ASP.NET Core + PostgreSQL",
      "Maker-checker, audit trail, batch & cascade approval",
      "448 route REST di belakang gateway KrakenD",
    ],
  },
  {
    period: "Des 2025 — Jan 2026",
    role: "Fullstack Developer",
    company: "Polda Jabar, Banten, Mako Brimob",
    location: "Freelance · Rikkes Berkala",
    points: [
      "Laravel + Livewire, role-based access control",
      "Import WhatsApp & Excel, laporan PDF otomatis",
      "Distribusi dokumen via Google Drive & Sheets",
    ],
  },
  {
    period: "2026 — sekarang",
    role: "Solo builder",
    company: "Produk & proyek mandiri",
    location: "Remote",
    points: [
      "SASTRO PACS · SYNVEA SIMRS · RadVault · Tilawah",
      "Lingkup, bangun, rilis, dan rawat sendiri",
    ],
  },
];

function FlowCard({ flow, index }: { flow: Flow; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const btnId = `alur-btn-${index}`;
  const panelId = `alur-panel-${index}`;

  return (
    <article className="flow-card overflow-hidden rounded-2xl border border-rule bg-paper-raised transition-colors duration-300 has-[button[aria-expanded='true']]:border-signal/60">
      <button
        id={btnId}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-5 sm:px-7"
      >
        <span
          aria-hidden="true"
          className={`readout hidden shrink-0 rounded-full border px-2.5 py-1 text-[10px] sm:inline ${
            flow.current
              ? "border-signal text-signal"
              : "border-rule text-ink-mute"
          }`}
        >
          {flow.period}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold tracking-tight text-ink sm:text-lg">
            {flow.role}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">
            {flow.company} · {flow.location}
          </span>
          <span className="readout mt-1 block text-[11px] text-ink-mute sm:hidden">
            {flow.period}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open
              ? "rotate-180 border-signal bg-signal text-signal-ink"
              : "border-rule text-ink"
          }`}
        >
          <ArrowDown size={15} weight="bold" />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        data-open={open}
        className="expand-grid"
      >
        <div className="expand-inner">
          <ul className="space-y-0 border-t border-rule px-5 py-2 sm:px-7">
            {flow.points.map((point, i) => (
              <li
                key={point}
                className="flex items-baseline gap-3 border-b border-rule/60 py-3 text-sm leading-relaxed text-ink last:border-b-0"
              >
                <span className="readout shrink-0 text-[11px] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Experience() {
  const { lang } = useLang();
  const { profile, experience } = useContent();
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    function onMove(e: PointerEvent) {
      const target = heroRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      setSpot({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      id="pengalaman"
      aria-labelledby="pengalaman-judul"
      className="mx-auto max-w-[1480px] px-5 pt-4 pb-24 sm:px-8 sm:pb-32"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-px w-7 bg-signal/60" />
            02 — {pick(lang, "Pengalaman", "Experience")}
          </p>
          <h2
            id="pengalaman-judul"
            className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            {pick(lang, "Jalur waktu", "Timeline")}
          </h2>
        </div>
        <p className="readout max-w-[30ch] text-left text-[11px] leading-relaxed text-ink-mute sm:text-right">
          {pick(lang, "Perbankan → pemerintahan → produk mandiri", "Banking → government → indie products")}
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-5">
        {/* Portrait panel with spotlight + CV. */}
        <div
          ref={heroRef}
          className="spot-card relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-2xl border border-rule bg-paper-deep sm:min-h-[24rem] lg:min-h-[26rem]"
          style={{ ["--mx" as string]: `${spot.x}%`, ["--my" as string]: `${spot.y}%` }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-[50%_12%]"
            style={{ backgroundImage: "url(/images/fadhli.jpg)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, color-mix(in srgb, var(--ink) 88%, transparent) 0%, color-mix(in srgb, var(--ink) 55%, transparent) 45%, transparent 82%)",
            }}
          />
          <div className="relative p-5 sm:p-8">
            <p className="readout text-[11px] text-white/80">
              {profile.name}
            </p>
            <p className="display-tight mt-1 max-w-[16ch] text-[1.65rem] leading-[1.05] text-white sm:text-4xl">
              {pick(
                lang,
                "Sistem yang bisa dipercaya saat datanya salah.",
                "Systems you can trust when the data is wrong.",
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href="/cv"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#101319] transition-colors duration-200 hover:bg-signal hover:text-signal-ink"
              >
                {pick(lang, "Lihat CV", "View CV")}
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center rounded-full border border-white/40 px-5 text-sm text-white transition-colors duration-200 hover:border-white"
              >
                LinkedIn
              </a>
            </div>
            <dl className="mt-6 grid grid-cols-1 gap-x-3 gap-y-3 border-t border-white/25 pt-4 min-[420px]:grid-cols-3">
              {pick(lang, meta, metaEn).map((m) => (
                <div key={m.label}>
                  <dt className="readout text-[10px] tracking-[0.1em] text-white/60 uppercase">
                    {m.label}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-white">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Flow cards. */}
        <div className="flex flex-col gap-4">
          {experience.map((flow: Flow, i: number) => (
            <FlowCard key={flow.company} flow={flow} index={i} />
          ))}

          <div className="rounded-2xl border border-rule bg-paper-raised px-5 py-5 sm:px-7">
            <h3 className="label flex items-center gap-2 text-ink-mute">
              <Certificate size={14} weight="regular" aria-hidden="true" />
              {pick(lang, "Sertifikasi", "Certifications")}
            </h3>
            <ul className="mt-3">
              {pick(lang, certs, certsEn).map((cert) => (
                <li
                  key={cert.name}
                  className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-2.5 last:border-b-0"
                >
                  <span className="min-w-0">
                    <span className="block text-sm leading-snug text-ink">
                      {cert.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-mute">
                      {cert.issuer}
                    </span>
                  </span>
                  <span className="readout shrink-0 text-[11px] text-ink-mute">
                    {cert.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

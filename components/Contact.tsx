"use client";

import { useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
} from "@phosphor-icons/react";
import { profile } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".contact-word > span", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          once: true,
        },
      });
    },
    { scope: root },
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <footer
      ref={root}
      id="kontak"
      aria-labelledby="kontak-judul"
      className="bg-instrument text-instrument-ink"
    >
      <div className="mx-auto max-w-[1480px] px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
        <p className="label flex items-center gap-3 text-instrument-mute">
          <span aria-hidden="true" className="h-px w-7 bg-instrument-rule" />
          04 — Kontak
        </p>

        <h2
          id="kontak-judul"
          className="display mt-5 text-[clamp(2.8rem,9vw,7.5rem)] uppercase"
          aria-label="Butuh sistem yang bisa dirawat?"
        >
          <span className="contact-word block overflow-hidden pb-[0.08em]">
            <span className="block">Butuh sistem</span>
          </span>
          <span className="contact-word block overflow-hidden pb-[0.1em]">
            <span className="block">
              yang <span className="text-[#8fb0ff]">bisa dirawat?</span>
            </span>
          </span>
        </h2>

        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[52ch] text-base leading-relaxed text-instrument-mute sm:text-lg">
            Saya menerima pekerjaan untuk aplikasi web, sistem internal, dan
            pekerjaan backend. Ceritakan kebutuhannya lewat surel — saya balas
            dengan pertanyaan yang perlu dijawab sebelum estimasi.
          </p>

          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#eceae3] px-7 text-sm font-medium text-[#101319] transition-colors duration-200 hover:bg-[#8fb0ff] hover:text-[#05080a] active:translate-y-px"
            >
              Kirim surel
              <ArrowUpRight
                size={16}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-instrument-rule px-6 text-sm text-instrument-ink transition-colors duration-200 hover:border-instrument-ink active:translate-y-px"
            >
              {copied ? (
                <Check size={15} weight="bold" aria-hidden="true" />
              ) : (
                <Copy size={15} weight="regular" aria-hidden="true" />
              )}
              <span aria-live="polite">
                {copied ? "Tersalin" : "Salin alamat"}
              </span>
            </button>
          </div>
        </div>

        <dl className="mt-14 grid gap-x-8 gap-y-6 border-t border-instrument-rule pt-7 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <dt className="label text-instrument-mute">Surel</dt>
            <dd className="mt-1.5 text-sm break-words">{profile.email}</dd>
          </div>
          <div>
            <dt className="label text-instrument-mute">Telepon</dt>
            <dd className="readout mt-1.5 text-sm">{profile.phone}</dd>
          </div>
          <div>
            <dt className="label text-instrument-mute">GitHub</dt>
            <dd className="mt-1.5 text-sm">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#8fb0ff]"
              >
                FadhliRajwaa
                <ArrowUpRight
                  size={12}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </dd>
          </div>
          <div>
            <dt className="label text-instrument-mute">LinkedIn</dt>
            <dd className="mt-1.5 text-sm">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#8fb0ff]"
              >
                fadhli-rajwaa-rahmana
                <ArrowUpRight
                  size={12}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-instrument-rule pt-6">
          <p className="readout text-[11px] text-instrument-mute">
            © 2026 {profile.name}
          </p>
          <p className="readout hidden text-[11px] text-instrument-mute sm:inline">
            SMG — ID · .NET / React
          </p>
          <a
            href="#atas"
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-instrument-rule px-5 py-2.5 text-xs text-instrument-ink transition-colors hover:border-instrument-ink"
          >
            Kembali ke atas
            <ArrowUp
              size={13}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

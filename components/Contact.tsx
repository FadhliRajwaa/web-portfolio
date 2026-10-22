"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { profile } from "@/lib/content";

export default function Contact() {
  const [copied, setCopied] = useState(false);

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
    <section
      id="kontak"
      aria-labelledby="kontak-judul"
      className="bg-instrument text-instrument-ink"
    >
      <div className="mx-auto max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-4xl">
          <h2
            id="kontak-judul"
            className="display text-[clamp(2.7rem,8vw,6rem)]"
          >
            Butuh sistem
            <br />
            yang bisa dirawat?
          </h2>

          <p className="mt-7 max-w-[48ch] text-base leading-relaxed text-instrument-mute sm:text-lg">
            Saya menerima pekerjaan untuk aplikasi web, sistem internal, dan
            pekerjaan backend. Ceritakan kebutuhannya lewat surel, saya balas
            dengan pertanyaan yang perlu dijawab sebelum estimasi.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {/* This panel is always dark, so the button must not follow the
                page theme: bg-paper turns near-black in dark mode and kills
                the contrast. It keeps a fixed light fill instead. */}
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex h-12 items-center gap-2 bg-[#eeebe3] px-6 text-sm font-medium text-[#12161a] transition-colors duration-200 hover:bg-[#8fb0ff] hover:text-[#05080a] active:translate-y-px"
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
              className="inline-flex h-12 items-center gap-2 border border-instrument-rule px-5 text-sm text-instrument-ink transition-colors duration-200 hover:border-instrument-ink active:translate-y-px"
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

        <dl className="mt-16 grid gap-x-8 gap-y-6 border-t border-instrument-rule pt-7 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="label text-instrument-mute">Surel</dt>
            <dd className="mt-1.5 text-sm break-all">{profile.email}</dd>
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
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[#8fb0ff]"
              >
                FadhliRajwaa
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
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
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[#8fb0ff]"
              >
                fadhli-rajwaa-rahmana
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

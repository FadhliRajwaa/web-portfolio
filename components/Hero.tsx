"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { profile, stats } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion, EASE } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // One authored moment on load: the name resolves, the dossier settles,
      // the figures count up. Nothing else animates on load.
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(".hero-line > span", {
        yPercent: 112,
        duration: 1.1,
        stagger: 0.09,
      }).from(
        ".hero-fade",
        { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 },
        "-=0.7",
      );

      gsap.utils.toArray<HTMLElement>(".hero-stat-value").forEach((el) => {
        const target = Number(el.dataset.count ?? "0");
        if (!target) return;
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.4,
          ease: EASE,
          delay: 0.5,
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="atas"
      aria-labelledby="hero-judul"
      className="relative overflow-hidden pt-32 sm:pt-40"
    >
      {/* Blueprint field, fading out before the stats band. */}
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-x-0 top-0 h-[42rem]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 30%, transparent 95%)",
          maskImage: "linear-gradient(to bottom, black 30%, transparent 95%)",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="hero-fade flex flex-wrap items-center justify-between gap-3">
          <p className="label flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-px w-7 bg-signal/60" />
            {profile.subtitle}
          </p>
          <p className="readout text-xs font-medium text-ink-soft">
            SMG — ID · 2025/2026
          </p>
        </div>

        <h1
          id="hero-judul"
          className="display mt-6 text-[clamp(3.6rem,13.5vw,11.5rem)] uppercase"
        >
          <span className="hero-line block overflow-hidden pb-[0.08em]">
            <span>Fadhli</span>
          </span>
          <span className="hero-line -mt-[0.06em] block overflow-hidden pb-[0.1em]">
            <span className="text-outline">Rajwaa</span>
          </span>
        </h1>

        <div className="mt-10 grid items-start gap-x-12 gap-y-10 md:grid-cols-[1fr_19rem] lg:grid-cols-[1fr_22rem]">
          <div className="max-w-[44rem]">
            <p className="hero-fade max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">
              Backend developer dengan pengalaman di perangkat lunak perbankan.
              Sekarang membangun produk kesehatan dan pemerintahan sebagai solo
              builder — dari skema basis data sampai antarmuka yang dipakai
              orang setiap hari.
            </p>

            <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#kerja"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal hover:text-signal-ink active:translate-y-px"
              >
                Lihat proyek
                <ArrowDownRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-rule-strong px-7 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink active:translate-y-px"
              >
                GitHub
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <span className="readout ml-1 hidden text-xs font-medium text-ink-soft sm:inline">
                07 sistem di bawah
              </span>
            </div>
          </div>

          {/* Dossier card: the person behind the systems. */}
          <aside
            aria-label="Profil singkat"
            className="hero-fade overflow-hidden rounded-2xl border border-rule bg-paper-raised"
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <span className="label text-ink-mute">Dossier</span>
              <span className="readout text-[11px] text-ink-mute">
                No. 001
              </span>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden bg-paper-deep">
              <Image
                src="/images/fadhli.jpg"
                alt="Fadhli Rajwaa Rahmana, full stack developer"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 352px"
                className="object-cover object-[50%_15%]"
              />
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {profile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-mute">{profile.role}</p>
                </div>
                <p className="flex shrink-0 items-center gap-1.5 text-xs text-ink-mute">
                  <span
                    aria-hidden="true"
                    className="relative flex size-1.5"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
                  </span>
                  Terbuka
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-rule pt-3">
                <span className="readout text-[11px] text-ink-mute">
                  {profile.location}
                </span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-xs font-medium text-signal hover:underline"
                >
                  Kirim surel
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* The figures, counted up once on entry. */}
        <dl className="mt-14 grid grid-cols-2 border-y border-rule lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`hero-fade px-2 py-6 sm:px-6 sm:py-7 ${
                i > 0 ? "border-l border-rule" : ""
              } ${i >= 2 ? "border-t border-rule lg:border-t-0" : ""} ${
                i === 2 ? "border-l-0 lg:border-l" : ""
              }`}
            >
              <dd
                className="hero-stat-value display-tight text-4xl text-ink sm:text-5xl"
                data-count={stat.value}
              >
                {stat.value}
              </dd>
              <dt className="label mt-2 text-ink-mute">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

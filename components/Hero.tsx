"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import StackOrbit from "./StackOrbit";
import { useContent, useUi } from "@/lib/i18n";
import { useLang, pick } from "./Lang";
import { gsap, useGSAP, prefersReducedMotion, EASE } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const { profile, stats } = useContent();
  const { openBadge, sendEmail } = useUi();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // One authored moment on load: the name resolves, the rig settles,
      // the figures count up. Nothing else animates on load.
      // A safety timeout below re-pins the final state: if fonts or images
      // shift the layout mid-timeline, no line may be left half-hidden.
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
      const safety = window.setTimeout(() => {
        tl.progress(1);
        gsap.set([".hero-line > span", ".hero-fade"], { clearProps: "all" });
      }, 4000);

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

      return () => window.clearTimeout(safety);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="atas"
      aria-labelledby="hero-judul"
      className="relative scroll-mt-24 overflow-hidden pt-28 sm:pt-40"
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

        <div className="mt-8 grid items-center gap-x-12 gap-y-10 lg:grid-cols-[1fr_26rem]">
          <div className="min-w-0">
            <h1
              id="hero-judul"
              className="display text-[clamp(2.6rem,7.5vw,5.5rem)] uppercase"
            >
              <span className="hero-line block overflow-hidden pb-[0.08em]">
                <span>Fadhli</span>
              </span>
              <span className="hero-line -mt-[0.03em] block overflow-hidden pt-[0.03em] pb-[0.1em]">
                <span className="text-outline">Rajwaa</span>
              </span>
            </h1>

            <p className="hero-fade mt-6 max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">
              {pick(
                lang,
                "Backend developer dengan pengalaman di perangkat lunak perbankan. Sekarang membangun produk kesehatan dan pemerintahan sebagai solo builder — dari skema basis data sampai antarmuka yang dipakai orang setiap hari.",
                "Backend developer with experience in banking software. Now building health and government products as a solo builder — from database schema to interfaces people use every day.",
              )}
            </p>

            <div className="hero-fade mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <a
                href="#kerja"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal hover:text-signal-ink active:translate-y-px"
              >
                {pick(lang, "Lihat proyek", "View work")}
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
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-rule-strong px-7 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink active:translate-y-px"
              >
                GitHub
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <span className="readout mt-1 hidden text-xs font-medium text-ink-soft sm:ml-1 sm:inline">
                {pick(lang, "07 sistem di bawah", "07 systems below")}
              </span>
            </div>
          </div>

          {/* Interactive 3D stack visual instead of a static oversized portrait. */}
          <div className="hero-fade min-w-0">
            <StackOrbit />
          </div>
        </div>

        {/* Dossier strip: the person behind the systems. */}
        <aside
          aria-label={pick(lang, "Profil singkat", "Short profile")}
          className="hero-fade mt-12 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 rounded-2xl border border-rule bg-paper-raised px-5 py-4 sm:flex sm:items-center sm:gap-5 sm:px-6"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-rule bg-paper-deep">
            <Image
              src="/images/fadhli.jpg"
              alt="Fadhli Rajwaa Rahmana, full stack developer"
              fill
              sizes="56px"
              className="object-cover object-[50%_15%]"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{profile.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink-mute">
              {profile.role} · {profile.location}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-ink-mute sm:ml-auto sm:shrink-0">
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            {openBadge}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="col-span-2 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal hover:text-signal-ink sm:col-span-1 sm:w-auto"
          >
            {sendEmail}
          </a>
        </aside>

        {/* The figures, counted up once on entry. */}
        <dl className="mt-10 grid grid-cols-2 border-y border-rule lg:grid-cols-4">
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

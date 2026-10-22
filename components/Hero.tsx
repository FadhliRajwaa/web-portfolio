"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import LiveEditor from "./LiveEditor";
import { profile, stats } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion, EASE } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // One authored moment on load: the name resolves, the aside settles,
      // then the scene panel wipes in. Nothing else animates on load.
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(".hero-line > span", {
        yPercent: 108,
        duration: 1.1,
        stagger: 0.08,
      })
        .from(".hero-aside", { y: 16, opacity: 0, duration: 0.8 }, "-=0.72")
        .from(
          ".hero-scene",
          { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "power2.inOut" },
          "-=0.95",
        )
        .from(
          ".hero-scene-meta",
          { opacity: 0, duration: 0.5, stagger: 0.06 },
          "-=0.5",
        );

      gsap.to(".hero-scene-inner", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="atas"
      aria-labelledby="hero-judul"
      className="relative pt-28 pb-0 sm:pt-32"
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-[1.42fr_0.58fr]">
          <div>
            <p className="label mb-6 flex items-center gap-3 text-signal sm:mb-8">
              <span aria-hidden="true" className="h-px w-7 bg-signal/50" />
              {profile.subtitle}
            </p>

            <h1
              id="hero-judul"
              className="display text-[clamp(3.1rem,11.4vw,9.6rem)]"
            >
              <span className="hero-line block overflow-hidden pb-[0.09em]">
                <span>Fadhli</span>
              </span>
              <span className="hero-line -mt-[0.05em] block overflow-hidden pb-[0.09em]">
                <span>Rajwaa</span>
              </span>
            </h1>

            <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-ink-soft sm:text-lg">
              Backend developer dengan pengalaman di perangkat lunak perbankan.
              Sekarang membangun produk kesehatan dan pemerintahan sebagai solo
              builder.
            </p>

            <dl className="mt-10 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-6 min-[400px]:grid-cols-3">
              <div>
                <dd className="readout text-2xl text-ink">43</dd>
                <dt className="mt-1 text-xs text-ink-mute">
                  Modul perbankan
                </dt>
              </div>
              <div>
                <dd className="readout text-2xl text-ink">33</dd>
                <dt className="mt-1 text-xs text-ink-mute">
                  Modul SIMRS
                </dt>
              </div>
              <div>
                <dd className="readout text-2xl text-ink">448</dd>
                <dt className="mt-1 text-xs text-ink-mute">Route REST</dt>
              </div>
            </dl>
          </div>

          <div className="hero-aside lg:pt-2">
            <figure className="mb-6">
              <div className="relative aspect-[3/4] w-full max-w-[19rem] overflow-hidden border border-rule bg-paper-deep sm:max-w-[21rem]">
                <Image
                  src="/images/fadhli.jpg"
                  alt="Fadhli Rajwaa Rahmana, full stack developer"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 384px"
                  className="object-cover object-[50%_12%]"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {profile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-mute">{profile.role}</p>
                </div>
                <p className="flex shrink-0 items-center gap-1.5 text-xs text-ink-mute">
                  <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-signal"
                  />
                  Terbuka
                </p>
              </figcaption>
            </figure>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#kerja"
                className="group inline-flex h-12 items-center gap-2 bg-ink px-6 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal active:translate-y-px"
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
                className="group inline-flex h-12 items-center gap-2 border border-rule-strong px-6 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink active:translate-y-px"
              >
                GitHub
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* The one large visual: the work itself, live. */}
        <div className="hero-scene relative mt-12 overflow-hidden bg-instrument sm:mt-16">
          <div className="hero-scene-inner relative">
            <div className="hero-scene-meta flex items-center justify-between gap-3 border-b border-instrument-rule px-4 py-2.5 sm:gap-4 sm:px-7 sm:py-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span className="label shrink-0 text-instrument-mute">
                  Workspace
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-px w-5 shrink-0 bg-instrument-rule sm:block"
                />
                <span className="readout shrink-0 text-[11px] text-instrument-ink">
                  .NET / C#
                </span>
              </div>
              <span className="readout flex shrink-0 items-center gap-1.5 text-[10px] text-[#8fb0ff] sm:gap-2 sm:text-[11px]">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 rounded-full bg-[#8fb0ff]"
                />
                Open
              </span>
            </div>

            <div className="relative h-[330px] w-full sm:h-[360px] lg:h-[380px]">
              <LiveEditor />
            </div>
          </div>

          <dl className="grid grid-cols-2 border-t border-instrument-rule sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-5 py-5 sm:px-7 ${
                  i > 0 ? "border-l border-instrument-rule" : ""
                } ${i >= 2 ? "border-t border-instrument-rule sm:border-t-0" : ""}`}
              >
                <dd className="readout text-2xl text-instrument-ink sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs text-instrument-mute">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
} from "@phosphor-icons/react";
import LiveEditor from "./LiveEditor";
import { useContent, useUi } from "@/lib/i18n";
import { useLang, pick } from "./Lang";
import { gsap, useGSAP, prefersReducedMotion, EASE } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  // The editor owns the typing state; its rendered <pre> is the only public
  // surface for "the code on screen right now". Reading it keeps LiveEditor
  // untouched while the copy button still copies exactly what is visible.
  const editorHost = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  // The window header names the file and repeats the editor's own typing
  // state, so the two can never disagree: both are read from the chrome
  // LiveEditor renders, never duplicated here.
  const [editorFile, setEditorFile] = useState("");
  const [editorSaved, setEditorSaved] = useState(false);
  const { lang } = useLang();
  const { profile, stats } = useContent();
  const { openBadge, sendEmail } = useUi();

  useEffect(() => {
    const shell = editorHost.current?.firstElementChild;
    const tabBar = shell?.firstElementChild;
    if (!tabBar) return;

    // Text-only reads: the file name is the word ending in ".cs" and the
    // state is LiveEditor's own "typing"/"saved". Both reads are optional —
    // if that component ever renames them the header falls back to its
    // bilingual default instead of breaking.
    const read = () => {
      const words = [...tabBar.querySelectorAll("span")].map(
        (s) => s.textContent?.trim() ?? "",
      );
      setEditorFile((prev) => {
        const next = words.find((w) => w.endsWith(".cs")) ?? "";
        return prev === next ? prev : next;
      });
      setEditorSaved((prev) => {
        const next = words.includes("saved");
        return prev === next ? prev : next;
      });
    };

    read();
    // Typing fires a mutation per character; coalesce reads to one per frame
    // so mirroring never competes with the typing timer.
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    });
    observer.observe(tabBar, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  async function copyCode() {
    const pre = editorHost.current?.querySelector("pre");
    // Each rendered line is its own <div>, so textContent alone would join
    // the whole file into one line. Read line by line instead. The
    // zero-width caret spacer is markup, not code: strip it or the pasted
    // snippet carries an invisible character.
    const lines = pre ? [...pre.querySelectorAll("div")] : [];
    const text = lines
      .map((line) => (line.textContent ?? "").replace(/​/g, ""))
      .join("\n")
      .trimEnd();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Same shape as Contact.tsx:39-47 — one domain-appropriate fallback
      // in the catch instead of a silent failure. Here that is the legacy
      // selection copy, so the button still puts the code on the clipboard
      // when the async Clipboard API is denied (non-HTTPS, permissions).
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        if (document.execCommand("copy")) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        }
      } finally {
        area.remove();
      }
    }
  }

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
                {pick(lang, "08 sistem di bawah", "08 systems below")}
              </span>
            </div>
          </div>

          {/* The work itself, live: the editor inside a white console window. */}
          <div className="hero-fade min-w-0">
            <div className="overflow-hidden rounded-2xl border border-rule bg-paper-raised shadow-[0_8px_30px_-12px_rgba(16,19,25,0.25)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2.5 border-b border-rule px-3 py-2 sm:px-4">
                <span aria-hidden="true" className="flex shrink-0 gap-1.5">
                  <span className="size-2.5 rounded-full border border-rule-strong" />
                  <span className="size-2.5 rounded-full border border-rule-strong" />
                  <span className="size-2.5 rounded-full border border-rule-strong" />
                </span>
                <span className="readout min-w-0 truncate text-[11px] text-ink-soft">
                  {editorFile || pick(lang, "editor langsung", "live editor")}
                </span>
                <span
                  aria-live="polite"
                  className={`readout ml-auto shrink-0 text-[10px] tracking-wide ${
                    editorSaved ? "text-status-ok" : "text-ink-mute"
                  }`}
                >
                  {editorSaved
                    ? pick(lang, "tersimpan", "saved")
                    : pick(lang, "mengetik", "typing")}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-rule px-3 text-[11px] font-medium text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:translate-y-px"
                >
                  {copied ? (
                    <Check size={13} weight="bold" aria-hidden="true" />
                  ) : (
                    <Copy size={13} weight="regular" aria-hidden="true" />
                  )}
                  {copied
                    ? pick(lang, "Tersalin", "Copied")
                    : pick(lang, "Salin kode", "Copy code")}
                </button>
              </div>

              {/* The editor keeps its own chrome: terminal strip and status
                  bar are the window body and footer. Only its tab strip is
                  hidden (CSS only, markup untouched) because the window
                  header above already names the file and the typing state. */}
              <div
                ref={editorHost}
                className="h-[330px] sm:h-[360px] lg:h-[380px] [&>div>*:first-child]:hidden"
              >
                <LiveEditor />
              </div>
            </div>
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

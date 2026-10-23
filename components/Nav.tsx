"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/content";

const links = [
  { href: "#kerja", label: "Proyek", index: "01" },
  { href: "#pengalaman", label: "Pengalaman", index: "02" },
  { href: "#keahlian", label: "Keahlian", index: "03" },
  { href: "#kontak", label: "Kontak", index: "04" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const first = menu.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menu.current) return;
      const items = menu.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!items.length) return;
      const head = items[0];
      const tail = items[items.length - 1];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    }

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open ]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-80 px-4 pt-4 sm:px-6">
        <div className="relative mx-auto max-w-[1480px]">
          <div className="flex items-center justify-between gap-3 rounded-full border border-rule bg-paper/85 py-2 pr-2 pl-5 shadow-[0_8px_30px_-12px_rgba(16,19,25,0.25)] backdrop-blur-md">
            <a
              href="#atas"
              className="group flex items-center gap-2.5"
              aria-label={`${profile.name}, kembali ke atas`}
            >
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-paper transition-colors duration-200 group-hover:bg-signal group-hover:text-signal-ink"
              >
                FR
              </span>
              <span className="leading-none">
                <span className="block text-sm font-semibold tracking-tight text-ink">
                  {profile.shortName}
                </span>
                <span className="mt-0.5 hidden items-center gap-1.5 text-[11px] text-ink-mute sm:flex">
                  <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-signal"
                  />
                  Terbuka untuk proyek
                </span>
              </span>
            </a>

            <nav aria-label="Navigasi utama" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-baseline gap-1.5 rounded-full px-4 py-2.5 text-sm text-ink-soft transition-colors duration-200 hover:bg-paper-deep hover:text-ink"
                    >
                      <span className="readout text-[10px] text-ink-mute transition-colors group-hover:text-signal">
                        {link.index}
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle className="rounded-full" />
              <a
                href={`mailto:${profile.email}`}
                className="group hidden h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal hover:text-signal-ink sm:inline-flex"
              >
                Kirim surel
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="menu-seluler"
                aria-label="Buka menu"
                className="inline-flex size-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink lg:hidden"
              >
                <List size={18} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Reading progress: how far through the dossier. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 -bottom-px h-px overflow-hidden"
          >
            <div
              className="h-full origin-left bg-signal"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      </header>

      {open ? (
        <div
          ref={menu}
          id="menu-seluler"
          className="fixed inset-0 z-85 flex flex-col bg-paper lg:hidden"
        >
          <div className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-2">
            <span className="label text-ink-mute">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-rule text-ink"
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigasi seluler" className="flex flex-1 flex-col justify-center px-5 pb-10">
            <ul className="border-t border-rule">
              {links.map((link) => (
                <li key={link.href} className="border-b border-rule">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-[76px] items-center justify-between py-4"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="readout text-xs text-signal">
                        {link.index}
                      </span>
                      <span className="display text-4xl transition-colors group-hover:text-signal">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="text-ink-mute"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${profile.email}`}
              onClick={() => setOpen(false)}
              className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-paper"
            >
              {profile.email}
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}

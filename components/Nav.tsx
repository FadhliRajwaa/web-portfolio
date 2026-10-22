"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/lib/content";

const links = [
  { href: "#kerja", label: "Proyek" },
  { href: "#pengalaman", label: "Pengalaman" },
  { href: "#keahlian", label: "Keahlian" },
  { href: "#kontak", label: "Kontak" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
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
        'a[href], button:not([disabled])',
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
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-80 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-b border-rule bg-paper/90 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-6 px-5 sm:px-8">
          <a
            href="#atas"
            className="group flex items-baseline gap-2.5 text-ink"
            aria-label={`${profile.name}, kembali ke atas`}
          >
            <span className="display text-[1.05rem] tracking-[-0.02em]">
              {profile.shortName}
            </span>
            <span className="label hidden text-ink-mute transition-colors group-hover:text-signal sm:inline">
              {profile.role}
            </span>
          </a>

          <nav aria-label="Navigasi utama" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="relative inline-block py-1 text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={`mailto:${profile.email}`}
              className="hidden h-10 items-center bg-ink px-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-signal sm:inline-flex"
            >
              Kirim surel
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-seluler"
              aria-label="Buka menu"
              className="inline-flex size-10 items-center justify-center border border-rule text-ink md:hidden"
            >
              <List size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          ref={menu}
          id="menu-seluler"
          className="fixed inset-0 z-85 flex flex-col bg-paper md:hidden"
        >
          <div className="flex h-16 items-center justify-between border-b border-rule px-5">
            <span className="label text-ink-mute">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="inline-flex size-10 items-center justify-center border border-rule text-ink"
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigasi seluler" className="flex-1 px-5 pt-4">
            <ul>
              {links.map((link) => (
                <li key={link.href} className="border-b border-rule">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5"
                  >
                    <span className="display text-4xl">{link.label}</span>
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
              className="mt-7 flex h-13 w-full items-center justify-center bg-ink text-sm font-medium text-paper"
            >
              {profile.email}
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}

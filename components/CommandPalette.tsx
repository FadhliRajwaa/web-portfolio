"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Globe,
  MagnifyingGlass,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { useContent, useUi } from "@/lib/i18n";
import { useLang, pick, type Lang } from "./Lang";

type Action = {
  id: string;
  label: string;
  keywords: string;
  icon: "go" | "project" | "theme" | "lang" | "copy" | "link";
  run: () => void;
};

function scrollToSlug(slug: string) {
  const btn = document.querySelector<HTMLElement>(
    `button[aria-controls*="${slug}"]`,
  );
  if (btn && btn.getAttribute("aria-expanded") === "false") btn.click();
  const card = document.getElementById(`proyek-panel-${slug}`)?.closest("article")
    ?? document.querySelector(`[id*="${slug}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CommandPalette() {
  const { lang, setLang } = useLang();
  const ui = useUi();
  const { projects, profile } = useContent();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduce, setReduce] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const listId = useId();
  const activeId = `${listId}-option`;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () =>
      setDark(document.documentElement.getAttribute("data-theme") === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  }

  const actions: Action[] = useMemo(() => {
    const other: Lang = lang === "id" ? "en" : "id";
    const list: Action[] = [];
    for (const link of ui.navLinks) {
      list.push({
        id: `go-${link.href}`,
        label: pick(lang, `Ke ${link.label}`, `Go to ${link.label}`),
        keywords: `${link.label} ${link.href} section navigasi navigation ${link.index}`,
        icon: "go",
        run: () =>
          document
            .querySelector(link.href)
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      });
    }
    for (const p of projects) {
      list.push({
        id: `project-${p.slug}`,
        label: pick(lang, `Buka ${p.name}`, `Open ${p.name}`),
        keywords: `${p.name} ${p.category} proyek project ${p.slug}`,
        icon: "project",
        run: () => scrollToSlug(p.slug),
      });
    }
    list.push(
      {
        id: "toggle-theme",
        label: dark
          ? pick(lang, "Mode terang", "Light mode")
          : pick(lang, "Mode gelap", "Dark mode"),
        keywords: "tema theme dark light mode gelap terang",
        icon: "theme",
        run: toggleTheme,
      },
      {
        id: "toggle-lang",
        label:
          other === "en"
            ? "Switch to English"
            : "Ganti ke Bahasa Indonesia",
        keywords: "bahasa language english indonesia",
        icon: "lang",
        run: () => setLang(other),
      },
      {
        id: "copy-email",
        label: pick(lang, "Salin surel", "Copy email"),
        keywords: `email surel copy salin ${profile.email}`,
        icon: "copy",
        run: () => {
          navigator.clipboard.writeText(profile.email).catch(() => {
            window.location.href = `mailto:${profile.email}`;
          });
        },
      },
      {
        id: "open-github",
        label: "GitHub — FadhliRajwaa",
        keywords: "github repo code",
        icon: "link",
        run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "open-linkedin",
        label: "LinkedIn",
        keywords: "linkedin kerja work profil profile",
        icon: "link",
        run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "open-cv",
        label: "CV",
        keywords: "cv resume riwayat",
        icon: "link",
        run: () => window.open("/cv", "_blank", "noopener,noreferrer"),
      },
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.navLinks, projects, profile, lang, dark]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.label} ${a.keywords}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  // Trigger: tombol nav (event) + Ctrl/Cmd+K. Abaikan saat fokus di input/textarea.
  useEffect(() => {
    function onOpenEvent() {
      triggerRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
        e.preventDefault();
        triggerRef.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      }
    }
    window.addEventListener("open-command-palette", onOpenEvent);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-command-palette", onOpenEvent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Fokus input saat buka; kembalikan ke pemicu saat tutup.
  useEffect(() => {
    if (open) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 30);
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
      };
    }
    if (triggerRef.current && document.contains(triggerRef.current)) {
      triggerRef.current.focus();
    } else {
      const fallback = document.querySelector<HTMLElement>(
        "[data-command-palette-trigger]",
      );
      fallback?.focus();
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  function onDialogKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = results[activeIndex];
      if (action) {
        close();
        window.setTimeout(() => action.run(), 30);
      }
    } else if (e.key === "Tab" && rootRef.current) {
      // Focus trap penuh seperti modal yang sudah ada.
      const items = rootRef.current.querySelectorAll<HTMLElement>(
        "input, [role='option'], button",
      );
      if (!items.length) return;
      const head = items[0];
      const tail = items[items.length - 1];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        (tail as HTMLElement).focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        (head as HTMLElement).focus();
      }
    }
  }

  if (!open) return null;

  const icons = {
    go: ArrowRight,
    project: ArrowRight,
    theme: dark ? Sun : Moon,
    lang: Globe,
    copy: Copy,
    link: ArrowUpRight,
  } as const;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={pick(lang, "Palet perintah", "Command palette")}
      onKeyDown={onDialogKey}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-90 flex items-start justify-center bg-ink/40 p-4 pt-[12vh] backdrop-blur-sm sm:pt-[16vh]"
      style={reduce ? undefined : { animation: "none" }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-rule bg-paper-raised shadow-[0_8px_30px_-12px_rgba(16,19,25,0.25)]">
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <MagnifyingGlass
            size={16}
            weight="regular"
            aria-hidden="true"
            className="shrink-0 text-ink-mute"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.palette.search}
            aria-label={ui.palette.search}
            aria-controls={listId}
            aria-activedescendant={results.length ? activeId : undefined}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-autocomplete="list"
            className="h-13 w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-ink-mute"
          />
          <kbd className="readout hidden shrink-0 rounded border border-rule px-1.5 py-0.5 text-[10px] leading-none text-ink-mute sm:inline">
            esc
          </kbd>
        </div>

        {results.length ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={pick(lang, "Hasil", "Results")}
            aria-activedescendant={activeId}
            className="max-h-[50vh] overflow-y-auto p-2"
          >
            {results.map((action, i) => {
              const Icon = icons[action.icon];
              const active = i === activeIndex;
              return (
                <li
                  key={action.id}
                  id={i === activeIndex ? activeId : undefined}
                  role="option"
                  aria-selected={active}
                  tabIndex={-1}
                  onMouseMove={() => setActiveIndex(i)}
                  onClick={() => {
                    close();
                    window.setTimeout(() => action.run(), 30);
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                    active ? "bg-signal-soft/70 text-ink" : "text-ink-soft"
                  }`}
                >
                  <Icon
                    size={15}
                    weight="regular"
                    aria-hidden="true"
                    className="shrink-0 text-signal"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {action.label}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-ink-mute">
            {ui.palette.noResult}
          </p>
        )}

        <p className="readout border-t border-rule px-4 py-2.5 text-[10px] text-ink-mute">
          {ui.palette.hint}
        </p>
      </div>
    </div>
  );
}

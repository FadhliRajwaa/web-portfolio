"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, pick } from "./Lang";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Stack Orbit — a lightweight 3D hero visual built from pure CSS/SVG, no WebGL.
 *
 * A .NET core sits at the center with three tilted orbit rings carrying the
 * real stack (C#, React, PostgreSQL, Docker, …). Rings rotate continuously;
 * the whole rig tilts toward the pointer (desktop, fine pointers only) and
 * each chip is clickable to spotlight that technology. On touch devices and
 * under prefers-reduced-motion the rig renders one composed static frame.
 *
 * Chips are real <button>s with aria-pressed so keyboard users get the same
 * spotlight behaviour as pointer users.
 */

type Node = {
  label: string;
  ring: 0 | 1 | 2;
  angle: number; // degrees around its ring
  detail: { id: string; en: string };
};

const NODES: Node[] = [
  { label: "C#", ring: 0, angle: 20, detail: { id: "43 modul parameter perbankan", en: "43 banking parameter modules" } },
  { label: "TypeScript", ring: 0, angle: 200, detail: { id: "SIMRS + Tilawah", en: "SIMRS + Tilawah" } },
  { label: "React", ring: 1, angle: 80, detail: { id: "PACS viewer + SIMRS", en: "PACS viewer + SIMRS" } },
  { label: "PostgreSQL", ring: 1, angle: 260, detail: { id: "Skema, migrasi, audit trail", en: "Schemas, migrations, audit trails" } },
  { label: "Docker", ring: 2, angle: 140, detail: { id: "DCM4CHEE + Orthanc", en: "DCM4CHEE + Orthanc" } },
  { label: "Laravel", ring: 2, angle: 320, detail: { id: "Rikkes Berkala 3 instansi", en: "Rikkes Berkala, 3 agencies" } },
];

const RING_RX = [150, 108, 78];
const RING_RY = [52, 96, 60];

export default function StackOrbit() {
  const { lang } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [motionOK, setMotionOK] = useState(false);
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setMotionOK(true);
  }, []);

  // Continuous slow spin, one rAF loop for the whole rig.
  useEffect(() => {
    if (!motionOK) return;
    let raf = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(64, now - last);
      last = now;
      setSpin((s) => (s + dt * 0.008) % 360);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [motionOK]);

  // Pointer tilt with GSAP quickTo for buttery response.
  useEffect(() => {
    if (!motionOK) return;
    const node = root.current;
    if (!node) return;
    const qx = gsap.quickTo(node, "--rx", { duration: 0.6, ease: "power3.out" });
    const qy = gsap.quickTo(node, "--ry", { duration: 0.6, ease: "power3.out" });
    function onMove(e: PointerEvent) {
      const rect = node!.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      qx(gsap.utils.clamp(-14, 14, nx * 28));
      qy(gsap.utils.clamp(-14, 14, -ny * 28));
    }
    function onLeave() {
      qx(0);
      qy(0);
    }
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [motionOK]);

  const cx = 200;
  const cy = 170;

  function pos(n: Node) {
    const a = ((n.angle + spin) * Math.PI) / 180;
    const rx = RING_RX[n.ring];
    const ry = RING_RY[n.ring];
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    // Depth cue: nodes "behind" (sin < 0) shrink and dim.
    const depth = (Math.sin(a) + 1) / 2; // 0 back … 1 front
    return { x, y, depth };
  }

  const activeNode = NODES.find((n) => n.label === active) ?? null;

  return (
    <div
      ref={root}
      className="stack-orbit relative mx-auto aspect-[400/340] w-full max-w-[26rem] select-none"
      style={{ ["--rx" as string]: "0deg", ["--ry" as string]: "0deg" }}
      role="group"
      aria-label={
        lang === "id"
          ? "Visual tumpukan teknologi interaktif"
          : "Interactive technology stack visual"
      }
    >
      <div className="orbit-tilt absolute inset-0">
        <svg
          viewBox="0 0 400 340"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="orbit-core" cx="50%" cy="42%" r="65%">
              <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.28" />
              <stop offset="60%" stopColor="var(--signal)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx={cx} cy={cy} rx="170" ry="120" fill="url(#orbit-core)" />

          {/* Orbit rings */}
          {[0, 1, 2].map((r) => (
            <ellipse
              key={r}
              cx={cx}
              cy={cy}
              rx={RING_RX[r]}
              ry={RING_RY[r]}
              fill="none"
              stroke="var(--rule-strong)"
              strokeOpacity={r === 1 ? 0.75 : 0.45}
              strokeDasharray={r === 1 ? "none" : "3 6"}
              strokeWidth="1.2"
            />
          ))}

          {/* Core */}
          <circle
            cx={cx}
            cy={cy}
            r="26"
            fill="var(--ink)"
          />
          <text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="var(--paper)"
            fontFamily="var(--font-jetbrains), monospace"
          >
            .NET
          </text>
        </svg>

        {/* Chips positioned over the SVG */}
        {NODES.map((n) => {
          const { x, y, depth } = pos(n);
          const scale = 0.78 + depth * 0.32;
          const isActive = active === n.label;
          return (
            <button
              key={n.label}
              type="button"
              onClick={() => setActive(isActive ? null : n.label)}
              aria-pressed={isActive}
              aria-label={`${n.label} — ${pick(lang, n.detail.id, n.detail.en)}`}
              className="absolute top-0 left-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap backdrop-blur-sm transition-colors duration-200"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`,
                opacity: 0.55 + depth * 0.45,
                zIndex: isActive ? 20 : Math.round(depth * 10),
                backgroundColor: isActive
                  ? "var(--signal)"
                  : "color-mix(in srgb, var(--paper-raised) 88%, transparent)",
                borderColor: isActive ? "var(--signal)" : "var(--rule-strong)",
                color: isActive ? "var(--signal-ink)" : "var(--ink)",
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      {/* Readout of the spotlighted chip */}
      <p
        aria-live="polite"
        className="readout absolute inset-x-0 -bottom-1 text-center text-[11px] text-ink-soft"
      >
        {activeNode
          ? `${activeNode.label} · ${pick(lang, activeNode.detail.id, activeNode.detail.en)}`
          : pick(
              lang,
              "Ketuk chip untuk detail",
              "Tap a chip for detail",
            )}
      </p>
    </div>
  );
}

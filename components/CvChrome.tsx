"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { useUi } from "@/lib/i18n";

export function BackHome() {
  const { backHome } = useUi();
  return (
    <Link
      href="/"
      className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-ink"
    >
      <ArrowLeft
        size={15}
        weight="bold"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-x-0.5"
      />
      {backHome}
    </Link>
  );
}

export function WebLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1 text-signal hover:underline"
    >
      fadhliportfolio.my.id
      <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
    </Link>
  );
}

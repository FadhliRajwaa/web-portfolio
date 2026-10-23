import type { Metadata } from "next";
import CvClient from "@/components/CvClient";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae ${profile.name} — ${profile.role}. English version available with the language toggle.`,
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  return <CvClient />;
}

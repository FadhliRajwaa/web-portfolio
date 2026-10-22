import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/Archivo-Variable.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
  fallback: ["ui-monospace", "monospace"],
});

const siteUrl = "https://www.fadhliportfolio.my.id";

const description =
  "Full stack developer: 43 modul parameter perbankan di SAMCO, PACS radiologi dengan viewer DICOM 3D, SIMRS 33 modul, dan produk publik. Backend .NET sampai antarmuka React.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fadhli Rajwaa - Full Stack Developer",
    template: "%s | Fadhli Rajwaa",
  },
  description,
  authors: [{ name: "Fadhli Rajwaa Rahmana", url: siteUrl }],
  creator: "Fadhli Rajwaa Rahmana",
  keywords: [
    "Fadhli Rajwaa",
    "full stack developer",
    "backend developer",
    ".NET",
    "C#",
    "ASP.NET Core",
    "React",
    "Next.js",
    "PACS",
    "SIMRS",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Fadhli Rajwaa",
    title: "Fadhli Rajwaa - Full Stack Developer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fadhli Rajwaa - Full Stack Developer",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2efe9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      {/*
        suppressHydrationWarning on <body> is deliberate: browser extensions
        (adblockers, translators, VPN tools) inject attributes such as
        `bis_skin_checked` or `__processed_<uuid>__` into the DOM before React
        hydrates. That is outside this app's control, and without this the
        console fills with hydration warnings that are not real defects.
        It only silences attribute diffs on this one element; genuine markup
        mismatches inside the tree are still reported.
      */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

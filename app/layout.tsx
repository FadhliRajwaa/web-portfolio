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

export const metadata: Metadata = {
  title: "Fadhli Rajwaa - Full Stack Developer",
  description:
    "Full stack developer yang membangun aplikasi web dari backend .NET sampai antarmuka React. Pengalaman di sistem perbankan dan proyek freelance end-to-end.",
  authors: [{ name: "Fadhli Rajwaa" }],
  openGraph: {
    title: "Fadhli Rajwaa - Full Stack Developer",
    description:
      "Backend .NET dan C# di sistem perbankan, lalu aplikasi web end-to-end sebagai solo builder.",
    type: "website",
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

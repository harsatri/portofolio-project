import type { Metadata } from "next";
import { Bodoni_Moda, Jost, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from "next/script";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://hasnatria.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Harsa Tri Novenda | Frontend & Full-Stack Web Developer",
    template: "%s | Harsa Tri Novenda",
  },
  description:
    "Portfolio Harsa Tri Novenda — Fresh Graduate S1 Sistem Informasi Universitas Telkom. Frontend & Full-Stack Web Developer dengan keahlian React.js, Next.js, Laravel, dan Node.js.",
  keywords: [
    "Harsa Tri Novenda",
    "Frontend Developer",
    "Full-Stack Developer",
    "Next.js",
    "Laravel",
    "Web Developer Indonesia",
    "Portfolio",
    "React.js",
    "TypeScript",
  ],
  authors: [{ name: "Harsa Tri Novenda", url: siteUrl }],
  creator: "Harsa Tri Novenda",
  openGraph: {
    title: "Harsa Tri Novenda — Frontend & Full-Stack Web Developer",
    description:
      "Portfolio dan showcase project Harsa Tri Novenda — Frontend & Full-Stack Web Developer.",
    url: "/",
    siteName: "Harsa Tri Novenda Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Harsa Tri Novenda — Frontend & Full-Stack Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsa Tri Novenda — Frontend & Full-Stack Web Developer",
    description:
      "Portfolio dan showcase project Harsa Tri Novenda — Frontend & Full-Stack Web Developer.",
    images: ["/opengraph-image"],
    creator: "@hasnatria",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${jost.variable} ${jetbrainsMono.variable} h-full antialiased light`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("theme");
                if (savedTheme === "dark") {
                  document.documentElement.classList.add("dark");
                  document.documentElement.classList.remove("light");
                } else {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.classList.add("light");
                }
              } catch (_) {}
            `,
          }}
        />
        <ThemeProvider>
          <AnalyticsTracker />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

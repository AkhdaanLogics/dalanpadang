import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { InstallAppButton } from "@/components/shared/install-app-button";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const accentFont = Cinzel({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Koleksi Keris Antik | Nusantara Heritage",
    template: "%s | Nusantara Heritage",
  },
  description:
    "Galeri koleksi keris antik bernuansa museum dengan kurasi premium, kode autentik, status koleksi, dan akses konsultasi cepat via WhatsApp.",
  keywords: [
    "keris antik",
    "koleksi keris",
    "keris nusantara",
    "keris historis",
    "koleksi senjata tradisional",
  ],
  applicationName: "Nusantara Heritage",
  category: "shopping",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Koleksi Keris Antik | Nusantara Heritage",
    description:
      "Galeri koleksi keris antik bernuansa museum dengan kurasi premium dan akses konsultasi cepat via WhatsApp.",
    type: "website",
    locale: "id_ID",
    siteName: "Nusantara Heritage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koleksi Keris Antik | Nusantara Heritage",
    description:
      "Galeri koleksi keris antik bernuansa museum dengan kurasi premium.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${headingFont.variable} ${accentFont.variable} ${bodyFont.variable} bg-[#efe3d4] text-[#3a2b22] antialiased`}
      >
        {children}
        <InstallAppButton />
        <Analytics />
      </body>
    </html>
  );
}

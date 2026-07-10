import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fortune Hestia — Limited Edition Villas | Live the Greek Life",
  description:
    "Fortune Hestia: limited-edition contemporary villas set within 50 acres of Greek-inspired landscape off Sarjapur Road, Bangalore. Architecture, land and legacy in equal measure.",
  keywords: [
    "Fortune Hestia",
    "villas Sarjapur Road",
    "luxury villas Bangalore",
    "The Fortune Group",
  ],
  openGraph: {
    title: "Fortune Hestia — Live the Greek Life",
    description:
      "Limited-edition contemporary villas set within 50 acres of Greek-inspired landscape off Sarjapur Road, Bangalore.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-canvas text-ink font-sans antialiased selection:bg-accent selection:text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

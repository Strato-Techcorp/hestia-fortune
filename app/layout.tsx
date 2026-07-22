import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W5WC8S49');`}
        </Script>
      </head>
      <body className="bg-canvas text-ink font-sans antialiased selection:bg-accent selection:text-ink">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W5WC8S49"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
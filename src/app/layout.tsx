import type { Metadata } from "next";
import { Outfit, Montserrat } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sellmycarnewcastle.uk"),
  title: {
    default: "Sell My Car Newcastle | Fast, Fair & No Fuss Car Selling",
    template: "%s | Sell My Car Newcastle",
  },
  description:
    "Newcastle's trusted car buying service. Get a free instant valuation, best offer from 7,500+ dealers, free home collection and same-day payment.",
  applicationName: "Sell My Car Newcastle",
  authors: [{ name: "Sell My Car Newcastle" }],
  keywords: [
    "sell car Newcastle",
    "car valuation Newcastle",
    "sell my car",
    "car dealers Newcastle",
    "instant car valuation",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.sellmycarnewcastle.uk",
    siteName: "Sell My Car Newcastle",
    title: "Sell My Car Newcastle | Fast, Fair & No Fuss Car Selling",
    description:
      "Get a free valuation, the best offer from 7,500+ dealers, and free home collection with same-day payment.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SellMyCarNCL",
    title: "Sell My Car Newcastle | Fast, Fair & No Fuss Car Selling",
    description:
      "Get a free valuation, the best offer from 7,500+ dealers, and free home collection with same-day payment.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sell My Car Newcastle",
  url: "https://www.sellmycarnewcastle.uk",
  logo: "https://www.sellmycarnewcastle.uk/logo.png",
  description:
    "Newcastle's trusted car buying service. Get a free instant valuation, best offer from 7,500+ dealers, free home collection and same-day payment.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Newcastle upon Tyne",
    addressRegion: "Tyne and Wear",
    addressCountry: "GB",
  },
  areaServed: ["Newcastle upon Tyne", "Gateshead", "Sunderland", "North East England"],
  email: "support@sellmycarnewcastle.co.uk",
  priceRange: "Free",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.4",
    reviewCount: "92250",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${outfit.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}

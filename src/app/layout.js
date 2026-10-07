import { Inter, Bebas_Neue } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, site, siteUrl } from "@/lib/site";

// next/font descarga y sirve la fuente localmente (sin el <link> a Google Fonts
// del HTML original), evitando el salto de layout y mejorando el rendimiento.
// Inter es una fuente variable: un solo archivo por estilo cubre todos los pesos.
const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

// Bebas Neue solo tiene un peso disponible (400/regular)
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

// La imagen al compartir el enlace (opengraph-image.jpg / twitter-image.jpg)
// y los iconos (favicon.ico, icon.png, apple-icon.png) están en esta misma
// carpeta: Next.js los detecta solos y los añade a todas las páginas.
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: "Prometheus Web",
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  category: "business",
  other: {
    "geo.region": "ES-PM",
    "geo.placename": site.city,
    "geo.position": `${site.geo.latitude};${site.geo.longitude}`,
    ICBM: `${site.geo.latitude}, ${site.geo.longitude}`,
    designer: "Prometheus Web",
  },
};

export const viewport = {
  themeColor: site.themeColor,
  colorScheme: "dark",
};

// Datos estructurados: le dicen a Google quiénes sois, dónde trabajáis y
// cómo contactaros (sirve para el panel de empresa y los resultados enriquecidos).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      alternateName: [site.shortName, `${site.name} Mallorca`],
      description: site.description,
      inLanguage: "es-ES",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      name: site.name,
      url: siteUrl,
      logo: absoluteUrl("/icon.png"),
      image: absoluteUrl("/opengraph-image.jpg"),
      description: site.description,
      email: site.email,
      telephone: site.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: "ES",
      },
      geo: { "@type": "GeoCoordinates", ...site.geo },
      areaServed: { "@type": "Place", name: "Mallorca" },
      founder: site.founders.map((name) => ({ "@type": "Person", name })),
      knowsLanguage: ["es", "ca", "en", "de"],
      sameAs: [site.instagram],
      knowsAbout: [
        "Producción audiovisual",
        "Fotografía profesional",
        "Gestión de redes sociales",
        "Meta Ads",
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <JsonLd data={jsonLd} />
        <Navbar />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

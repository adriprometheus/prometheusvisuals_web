import { Inter, Bebas_Neue} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// next/font descarga y sirve la fuente localmente (sin el <link> a Google Fonts
// del HTML original), evitando el salto de layout y mejorando el rendimiento.
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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

const siteUrl = "https://www.prometheusvisuals.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prometheus Visuals",
    template: "%s | Prometheus Visuals",
  },
  description:
    "Especialistas en producción audiovisual cinematográfica, fotografía de alto impacto y crecimiento en redes sociales para marcas en Mallorca.",
  applicationName: "Prometheus Visuals",
  authors: [{ name: "Prometheus Visuals" }],
  creator: "Prometheus Web",
  publisher: "Prometheus Visuals",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  icons: {
    icon: "https://www.prometheusvisuals.com/logos/Prometheus-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Prometheus Visuals",
    url: siteUrl,
    title: "Prometheus Visuals | Agencia de Márketing",
    description:
      "Fotografía y vídeo profesional con personalidad propia. Creamos contenido visual de alta calidad para empresas y marcas.",
    images: [
      {
        url: "https://www.prometheusvisuals.com/logos/Prometheus-openGraphcard-logo.png",
        width: 1200,
        height: 630,
        alt: "Prometheus Visuals",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prometheus Visuals | Producción Audiovisual en Mallorca",
    description:
      "Fotografía y vídeo profesional con personalidad propia. Creamos contenido visual de alta calidad para empresas y marcas.",
    images: [
      "https://www.prometheusvisuals.com/logos/Prometheus-openGraphcard-logo.png",
    ],
  },
  other: {
    "geo.region": "ES-PM",
    "geo.placename": "Palma",
    "geo.position": "39.5696;2.6502",
    ICBM: "39.5696, 2.6502",
    designer: "Prometheus Web",
    copyright: "© 2026 Prometheus Visuals. Todos los derechos reservados.",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Prometheus Visuals",
    alternateName: ["Prometheus", "Prometheus Visuals Mallorca"],
    url: "https://www.prometheusvisuals.com",
  };
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable}`} data-scroll-behavior="smooth">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18404658605"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18404658605');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
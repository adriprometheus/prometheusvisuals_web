// Datos globales de la web: SEO, vista previa al compartir enlaces y datos
// estructurados (schema.org). Si cambia algo de la empresa, se cambia aquí.

export const siteUrl = "https://www.prometheusvisuals.com";

export const site = {
  name: "Prometheus Visuals",
  shortName: "Prometheus",
  title: "Prometheus Visuals | Producción audiovisual y redes sociales en Mallorca",
  description:
    "Agencia audiovisual en Mallorca: vídeo cinematográfico, fotografía profesional, gestión de redes sociales y campañas de Meta Ads para marcas que quieren vender más.",
  locale: "es_ES",
  email: "contacto@prometheusvisuals.com",
  phone: "+34639412229",
  whatsapp: "https://wa.me/34639412229",
  instagram: "https://www.instagram.com/prometheus.visuals",
  city: "Palma",
  region: "Illes Balears",
  geo: { latitude: 39.5696, longitude: 2.6502 },
  founders: ["Marc Pons", "Jordi Jiménez"],
  themeColor: "#000000",
};

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

// Imagen al compartir (src/app/opengraph-image.jpg y twitter-image.jpg).
const shareImage = {
  width: 1200,
  height: 630,
  alt: "Prometheus Visuals — Producción audiovisual y gestión de redes sociales en Mallorca",
};

// Metadatos de una página interior. Next.js no fusiona `openGraph` ni
// `twitter` entre el layout y las páginas (la página los sustituye enteros,
// imagen incluida), así que aquí se repiten los campos comunes.
export function pageMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title,
      description,
      images: [{ url: "/opengraph-image.jpg", type: "image/jpeg", ...shareImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/twitter-image.jpg", ...shareImage }],
    },
  };
}

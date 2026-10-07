import { Suspense } from "react";
import VideoGallery from "@/components/VideoGallery";
import JsonLd from "@/components/JsonLd";
import { videos } from "@/data/videos";
import { absoluteUrl, pageMetadata, siteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Porfolio de vídeo y producción audiovisual en Mallorca",
  description:
    "Vídeos corporativos, spots gastronómicos, sector hotelero y eventos en Mallorca. Mira las producciones audiovisuales de Prometheus Visuals.",
  path: "/films",
});

// Cada vídeo como VideoObject para que pueda salir en Google Vídeos.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: videos.map((video, index) => ({
    "@type": "VideoObject",
    position: index + 1,
    name: video.fullTitle,
    description: video.description,
    thumbnailUrl: absoluteUrl(video.poster),
    contentUrl: absoluteUrl(video.videoMp4),
    uploadDate: `${video.fecha}-01-01T00:00:00+01:00`,
    url: absoluteUrl(`/films?videoId=${video.id}`),
    contentLocation: { "@type": "Place", name: `${video.lugar}, Mallorca` },
    publisher: { "@id": `${siteUrl}/#organization` },
  })),
};

export default function FilmsPage() {
  return (
    <main className="w-full bg-black min-h-screen pt-navbar pb-24 text-white overflow-x-hidden">
      <JsonLd data={jsonLd} />
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          PORFOLIO AUDIOVISUAL
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl">
          Explora nuestros proyectos audiovisuales. Haz clic en cualquier
          tarjeta para abrir la pieza en el reproductor.
        </p>
      </section>
      <Suspense fallback={null}>
        <VideoGallery />
      </Suspense>
    </main>
  );
}

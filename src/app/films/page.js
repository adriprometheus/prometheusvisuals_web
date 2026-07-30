import { Suspense } from "react";
import VideoGallery from "@/components/VideoGallery";

export const metadata = {
  title: "Descubre el porfolio de Vídeo de Prometheus Visuals",
  description:
    "Porfolio de producciones audiovisuales y vídeo marketing en Mallorca. Especialistas en vídeos corporativos, spots gastronómicos, sector hotelero y eventos.",
  alternates: { canonical: "/films" },
  openGraph: {
    title: "Descubre el porfolio de Vídeo de Prometheus Visuals",
    description:
      "Porfolio de producciones audiovisuales y vídeo marketing en Mallorca. Especialistas en vídeos corporativos, spots gastronómicos, sector hotelero y eventos.",
    url: "/films",
  },
};

export default function FilmsPage() {
  return (
    <main className="w-full bg-black min-h-screen pt-navbar pb-24 text-white overflow-x-hidden">
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

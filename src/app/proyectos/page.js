import { Suspense } from "react";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata = {
  title: "Descubre el porfolio de Fotos de Prometheus Visuals",
  description:
    "Explora nuestro porfolio de fotografía profesional. Capturamos la esencia de marcas, gastronomía, eventos y proyectos comerciales con un estilo único.",
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: "GDescubre el porfolio de Fotos de Prometheus Visuals",
    description:
      "Explora nuestro porfolio de fotografía profesional. Capturamos la esencia de marcas, gastronomía, eventos y proyectos comerciales con un estilo único.",
    url: "/proyectos",
  },
};

export default function ProyectosPage() {
  return (
    <main className="mt-navbar">
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          PORFOLIO FOTOGRÁFICO
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl">
          Explora nuestra selección de proyectos fotográficos. Haz clic en
          cualquier imagen para abrir la vista detallada a pantalla completa.
        </p>
      </section>
      <Suspense fallback={null}>
        <PhotoGallery />
      </Suspense>
    </main>
  );
}

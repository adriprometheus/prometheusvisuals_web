import { Suspense } from "react";
import PhotoGallery from "@/components/PhotoGallery";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Porfolio de fotografía profesional en Mallorca",
  description:
    "Fotografía profesional para marcas, gastronomía, hoteles y eventos en Mallorca. Descubre los proyectos fotográficos de Prometheus Visuals.",
  path: "/proyectos",
});

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

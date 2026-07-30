import WhyPrometheus from "@/components/Home/WhyPrometheus"; //Usar en un futuro cuando tenga sentido
import ServicesMenu from "@/components/Home/ServicesMenu";
import Pricing from "@/components/Home/Pricing";
import SuccessCase from "@/components/Home/SuccessCase";
import InteractiveGallery from "@/components/Home/InteractiveGallery";
import ConversionHub from "@/components/Home/ConversionHub";
import Hero from "@/components/Home/Hero";

export const metadata = {
  title:
    "¿Qué es Prometheus Visuals? Producción Audiovisual y Gestión de Redes Sociales en Mallorca",
  description:
    "Especialistas en producción audiovisual cinematográfica, fotografía de alto impacto y crecimiento en redes sociales para marcas en Mallorca.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="w-full bg-black text-neutral-200">
    {/* HERO SECTION */}
   <Hero />

      {/* SECCIONES MODULARES */}
      <ServicesMenu />
      <Pricing />
      <InteractiveGallery />
      <ConversionHub />
    </main>
  );
}

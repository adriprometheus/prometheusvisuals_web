import ServicesMenu from "@/components/Home/ServicesMenu";
import Pricing from "@/components/Home/Pricing";
import InteractiveGallery from "@/components/Home/InteractiveGallery";
import ConversionHub from "@/components/Home/ConversionHub";
import Hero from "@/components/Home/Hero";
import { site } from "@/lib/site";

export const metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="w-full bg-black text-neutral-200">
      <Hero />

      {/* SECCIONES MODULARES */}
      <ServicesMenu />
      <Pricing />
      <InteractiveGallery />
      <ConversionHub />
    </main>
  );
}

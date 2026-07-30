import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contacta con el equipo de Prometheus Visuals",
  description:
    "¿Tienes un proyecto en mente? Contacta con Prometheus Visuals en Mallorca. Cuéntanos tu idea de fotografía o vídeo y solicita tu presupuesto personalizado.",
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacta con el equipo de Prometheus Visuals",
    description:
      "¿Tienes un proyecto en mente? Contacta con Prometheus Visuals en Mallorca. Cuéntanos tu idea de fotografía o vídeo y solicita tu presupuesto personalizado.",
    url: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <main className="mt-navbar mx-auto flex max-w-384 flex-col items-center gap-10 px-6 py-14 lg:flex-row lg:items-start lg:px-10">
      <Image
        src="/fotos/Jefes-juntos-contact-form.webp"
        alt="Marc y Jordi, fundadores de Prometheus Visuals"
        width={640}
        height={800}
        className="w-full max-w-md rounded-2xl object-cover lg:w-1/2 lg:max-w-xl"
      />
      <div className="w-full lg:w-1/2">
        <h1 className="mb-8 text-h2 font-bold">HABLEMOS DE TU PROYECTO</h1>
        <ContactForm />
      </div>
    </main>
  );
}

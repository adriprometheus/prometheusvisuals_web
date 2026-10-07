import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contacto: pide presupuesto de foto y vídeo en Mallorca",
  description:
    "¿Tienes un proyecto en mente? Cuéntanos tu idea de fotografía, vídeo o redes sociales y te respondemos en menos de 24 horas con una propuesta para tu marca en Mallorca.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <main className="mt-navbar mx-auto flex max-w-384 flex-col items-center gap-10 px-6 py-14 lg:flex-row lg:items-start lg:px-10">
      <Image
        src="/fotos/Jefes-juntos-contact-form.webp"
        alt="Marc y Jordi, fundadores de Prometheus Visuals"
        width={640}
        height={800}
        sizes="(max-width: 1024px) 448px, 576px"
        priority
        className="w-full max-w-md rounded-2xl object-cover lg:w-1/2 lg:max-w-xl"
      />
      <div className="w-full lg:w-1/2">
        <h1 className="mb-8 text-h2 font-bold">HABLEMOS DE TU PROYECTO</h1>
        <ContactForm />
      </div>
    </main>
  );
}

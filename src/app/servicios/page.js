import Image from "next/image";
import Link from "next/link";
import ServicesFAQ from "@/components/ServicesFAQ";
import { mainServices } from "@/data/mainServices";

export const metadata = {
  title: "Servicios de Producción Audiovisual y Redes Sociales en Mallorca",
  description:
    "Servicios de rodaje cinematográfico, fotografía profesional, gestión de feeds en Instagram y campañas Meta Ads en Mallorca. Impulsa tu marca con Prometheus Visuals.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Servicios de Producción Audiovisual y Estrategia Digital",
    description:
      "Producción de vídeo cinematográfico, fotografía comercial, gestión estética de redes y publicidad orientada a ventas en Mallorca.",
    url: "/servicios",
  },
};

export default function ServicesPage() {
  return (
    <main className="w-full bg-black text-neutral-200">
      <section className="relative pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-6xl mx-auto text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          PROMETHEUS VISUALS — MALLORCA
        </span>
        <h1 className="text-[1.30rem] sm:text-6xl font-bold tracking-tight text-white mt-4 leading-tight">
          SERVICIOS DE PRODUCCIÓN AUDIOVISUAL Y CRECIMIENTO DIGITAL
        </h1>
        <p className="mt-6 text-base sm:text-lg  text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          Diseñamos piezas visuales cinematográficas, estructuramos feeds
          estéticos y gestionamos campañas publicitarias para marcas que buscan
          destacar y vender más.
        </p>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5">
            <Image
              src="/fotos/expo(5).webp"
              alt="Producción de vídeo comercial en Mallorca"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5 mt-4">
            <Image
              src="/fotos/expo(18).webp"
              alt="Fotografía de producto y gastronomía"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5">
            <Image
              src="/fotos/expo(9).webp"
              alt="Edición y retoque fotográfico"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5 mt-4">
            <Image
              src="/fotos/expo(60).webp"
              alt="Estrategia de contenido visual en Instagram"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-32">
        {mainServices.map((service, index) => (
          <article
            key={service.id}
            id={service.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center scroll-mt-32 ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`lg:col-span-7 space-y-6 ${
                index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 bg-neutral-900 border border-white/10 px-3 py-1 rounded-full uppercase">
                {service.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl mt-4 font-bold text-white tracking-tight">
                {service.title}
              </h2>
              <p className="text-base font-medium text-neutral-300 text-justify">
                {service.subtitle}
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed text-justify">
                {service.description}
              </p>

              <ul className="space-y-3 pt-2 text-xs text-neutral-300">
                {service.features.map((item, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-white shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black bg-white px-6 py-3 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  Solicitar este servicio
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div
              className={`lg:col-span-5 grid grid-cols-2 gap-4 ${
                index % 2 !== 0 ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="relative aspect-3/4 rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
                <Image
                  src={service.images[0].src}
                  alt={service.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-3/4 rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl mt-8">
                <Image
                  src={service.images[1].src}
                  alt={service.images[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </article>
        ))}
      </section>

      <ServicesFAQ />

      <section className="border-t border-white/5 py-24 px-6 text-center bg-neutral-950/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[1.33rem] font-bold text-white mb-4">
            ¿PREPARADO PARA TRANSFORMAR LA IMAGEN DE TU EMPRESA?
          </h2>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed text-justify">
            Analizamos tu marca sin compromiso y te ayudamos a definir el plan
            audiovisual que mejor se adapte a tus objetivos comerciales en
            Mallorca.
          </p>
          <Link
            href="/contacto"
            className="inline-block rounded-full bg-white px-8 py-4 text-xs font-semibold text-black hover:bg-neutral-200 transition-colors"
          >
            HABLAR CON EL EQUIPO
          </Link>
        </div>
      </section>
    </main>
  );
}

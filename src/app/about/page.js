import React from "react";
import { workers } from "@/data/workers";
import WorkerCard from "@/components/WorkerCard";
import ClientCarousel from "@/components/ClientsSlider";

export const metadata = {
  title:
    "Conoce más sobre Prometheus Visuals, la agencia audiovisual líder en Mallorca",
  description:
    "Consolidarnos como la agencia audiovisual y de estrategia digital de referencia en Mallorca para marcas locales e internacionales. Acompañamos a nuestros clientes en rodajes presenciales, curaduría estética de perfil y optimización continua de campañas publicitarias en Meta Ads.",
  alternates: { canonical: "/about" },
  openGraph: {
    title:
      "Conoce más sobre Prometheus Visuals, la agencia audiovisual líder en Mallorca",
    description:
      "Consolidarnos como la agencia audiovisual y de estrategia digital de referencia en Mallorca para marcas locales e internacionales. Acompañamos a nuestros clientes en rodajes presenciales, curaduría estética de perfil y optimización continua de campañas publicitarias en Meta Ads.",
    url: "/about",
  },
};

const scrollingMembers = [...workers, ...workers];

export default function AboutPage() {
  return (
    <main className="mt-navbar min-h-[calc(100vh-var(--spacing-navbar))] bg-black text-neutral-200 px-6 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-6 space-y-10 pr-0 lg:pr-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
              NUESTRA TRAYECTORIA
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              HISTORIAS QUE SE VEN, SE SIENTEN Y CONVIERTEN.
            </h1>
            <p className="text-lg text-justify text-neutral-400 leading-relaxed max-w-xl">
              Nacimos en Mallorca para elevar el nivel visual de las empresas.
              Unimos la narrativa cinematográfica con la estrategia digital para
              crear marcas memorables y rentables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="bg-white/5 backdrop-blur-lg border border-orange-500/50 rounded-3xl p-8 space-y-3 transition-all duration-300 hover:border-orange-500/40">
              <h2 className="text-xl font-bold text-white">Nuestro Objetivo</h2>
              <p className="text-sm text-neutral-400 text-justify leading-relaxed">
                Crear contenido que no solo se vea bien, sino que consiga resultados. Cada idea, cada plano y cada campaña tienen un propósito: captar la atención, transmitir el valor de tu marca y convertir ese interés en clientes. Porque para nosotros, la creatividad solo tiene sentido cuando impulsa el crecimiento de tu negocio.
              </p>
            </div>
          </div>
        </section>

        <section className="lg:col-span-6 grid grid-cols-1 lg:grid-cols-6 gap-6 items-center justify-center lg:h-full lg:min-h-0 w-full relative">
          <div className="hidden lg:flex items-center justify-center select-none lg:col-span-1 xl:col-start-3 lg:col-start-2">
            <h2 className="text-6xl lg:text-7xl font-black text-neutral-800 tracking-widest uppercase origin-center -rotate-90 whitespace-nowrap opacity-40">
              El Equipo
            </h2>
          </div>

          <div className="w-full lg:h-full lg:col-span-4 xl:col-span-3 lg:col-start-3 xl:col-start-4 relative flex flex-col min-h-0">
            <div className="lg:hidden text-center mb-8 shrink-0">
              <h2 className="text-3xl font-black text-neutral-200 tracking-wider uppercase">
                EQUIPO
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden w-full">
              {workers.map((member) => (
                <WorkerCard key={member.id} member={member} />
              ))}
            </div>

            <div
              className="hidden lg:block lg:absolute lg:inset-0 overflow-hidden rounded-[40px] border border-neutral-800 bg-neutral-950/80 p-4 w-full perspective-container
              before:absolute before:top-0 before:left-0 before:right-0 before:h-24 before:bg-linear-to-b before:from-black before:to-transparent before:z-20 before:pointer-events-none
              after:absolute after:bottom-0 after:left-0 after:right-0 after:h-24 after:bg-linear-to-t after:from-black after:to-transparent after:z-20 after:pointer-events-none"
            >
              <div className="flex flex-col gap-6 animate-wheel">
                {scrollingMembers.map((member, index) => (
                  <WorkerCard
                    key={`${member.id}-${index}`}
                    member={member}
                    className="wheel-card shrink-0 shadow-2xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <ClientCarousel />
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

const SERVICES = [
  {
    num: "01",
    title: "Producción audiovisual",
    description:
      "Producimos contenido que hace que la gente deje de hacer scroll y empiece a prestar atención.",
    href: "/servicios/#produccion-audiovisual",
  },
  {
    num: "02",
    title: "Gestión de Redes Sociales",
    description:
      "Planificamos y gestionamos el contenido de tus redes sociales para aumentar tu visibilidad, fortalecer tu marca y generar una comunidad activa.",
    href: "/servicios/#gestion-redes-sociales",
  },
  {
    num: "03",
    title: "Campañas Meta Ads",
    description:
      "Con Meta Ads hacemos que tus clientes ideales encuentren tu marca antes que a la competencia.",
    href: "/servicios/#meta-ads-conversion",
  },
];

export default function ServicesMenu() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-neutral-950/40 border-y border-white/5 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 sm:mb-16">
          <span className="block text-center text-xs uppercase tracking-widest text-neutral-500 font-semibold">
  NUESTROS SERVICIOS
</span>
          <h2 className="text-[1.74rem] sm:text-4xl font-bold tracking-tight text-white mt-2 text-center">
  QUÉ PODEMOS HACER POR TI
          </h2>
        </div>

        <div className="border-t border-white/10">
          {SERVICES.map((service, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={service.num} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start sm:items-center justify-between gap-4 sm:gap-6 py-6 sm:py-8 text-left"
                >
                  <span className="flex items-start sm:items-baseline gap-3 sm:gap-6 min-w-0">
                    <span
                      className={`font-[family-name:var(--font-bebas)] text-3xl sm:text-5xl leading-none tracking-wide transition-colors ${
                        isOpen
                          ? "text-white"
                          : "text-neutral-500 group-hover:text-neutral-300"
                      }`}
                    >
                      {service.title}
                    </span>
                  </span>

                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 border-orange-500 text-orange-500"
                        : "border-white/20 text-neutral-500 group-hover:border-white/40 group-hover:text-white"
                    }`}
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current" />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="max-w-xl pb-8 pl-0 sm:pl-16">
                      <p className="mb-4 text-sm leading-relaxed text-neutral-400">
                        {service.description}
                      </p>
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-1 text-xs font-medium text-white transition-colors hover:text-orange-400"
                      >
                        Saber más <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <Link
            href="/servicios"
            className="rounded-full bg-white px-8 py-3 text-xs font-semibold tracking-wider text-black transition-colors hover:bg-neutral-200"
          >
            VER TODOS LOS SERVICIOS
          </Link>
        </div>
      </div>
    </section>
  );
}
import React from "react";
import Image from "next/image";
import { clients } from "@/data/clients";

export default function ClientCarousel() {
  const half = Math.ceil(clients.length / 2);
  const firstRow = clients.slice(0, half);
  const secondRow = clients.slice(half);

  return (
    <section className="w-full py-16 bg-black overflow-hidden flex flex-col">
      {/* Cabecera del Carrusel */}
      <div className="px-6 lg:px-16 max-w-7xl mx-auto w-full mb-2">
        <h2 className="text-[1.4rem] text-center lg:text-3xl font-bold text-white tracking-tight mt-1">
          CLIENTES QUE HAN CONFIADO EN PROMETHEUS VISUALS
        </h2>
      </div>

      {/* Contenedor de las filas */}
      <div className="w-full flex flex-col gap-6 relative overflow-hidden select-none">
        {/* FILA 1: Izquierda
          - El contenedor padre tiene gap-0 para que el Bloque 1 y el Bloque 2 estén pegados.
          - Cada bloque interno tiene un pr-16 (padding derecho) que actúa como el "gap" de unión.
        */}
        <div className="flex shrink-0 w-max gap-0 animate-marquee hover:[animation-play-state:paused] will-change-transform">
          {/* Bloque Original */}
          <div className="flex shrink-0 gap-16 pr-16">
            {firstRow.map((client) => (
              <LogoCard key={`row1-orig-${client.file}`} client={client} />
            ))}
          </div>
          {/* Bloque Duplicado (Espejo exacto con el mismo padding y gap) */}
          <div className="flex shrink-0 gap-16 pr-16" aria-hidden="true">
            {firstRow.map((client) => (
              <LogoCard key={`row1-dup-${client.file}`} client={client} />
            ))}
          </div>
        </div>

        {/* FILA 2: Derecha */}
        <div className="flex shrink-0 w-max gap-0 animate-marquee-reverse hover:[animation-play-state:paused] will-change-transform">
          {/* Bloque Original */}
          <div className="flex shrink-0 gap-16 pr-16">
            {secondRow.map((client) => (
              <LogoCard key={`row2-orig-${client.file}`} client={client} />
            ))}
          </div>
          {/* Bloque Duplicado */}
          <div className="flex shrink-0 gap-16 pr-16" aria-hidden="true">
            {secondRow.map((client) => (
              <LogoCard key={`row2-dup-${client.file}`} client={client} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCard({ client }) {
  return (
    // Añadimos width y height fijos explícitos para asegurar que no colapsen en el cálculo dinámico
    <div className="group/logo relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center rounded-2xl transition-all duration-300 shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_20%,transparent_70%)] opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      <div className="relative w-full h-full transition-all duration-300">
        <Image
          src={`/logos/${client.file}.webp`}
          alt={client.alt}
          fill
          sizes="(max-width: 768px) 144px, 176px"
          className={`object-contain ${
                client.dark
                  ? "filter invert-[0.85] brightness-125 contrast-200"
                  : "filter brightness-125 opacity-60"
              }`}
          priority // Ayuda a que las dimensiones se calculen inmediatamente al cargar la página
        />
      </div>
    </div>
  );
}

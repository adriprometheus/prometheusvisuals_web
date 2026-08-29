"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollToPricing from "@/components/ScrollToPricing";
import ScrollToContact from "@/components/ScrollToContact";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Escritorio (sin cambios, ya te gusta cómo queda)
  const videoTop = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"]);
  const videoSide = useTransform(scrollYProgress, [0, 0.5], ["6%", "0%"]);
  const videoBottom = useTransform(scrollYProgress, [0, 0.5], ["6%", "0%"]);
  const videoRadius = useTransform(scrollYProgress, [0, 0.5], [28, 0]);

  return (
    <section className="relative w-full bg-black">
      {/* ================= ESCRITORIO (igual que ya tienes) ================= */}
      <div
        ref={containerRef}
        className="relative hidden h-[240vh] w-full md:block"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-start px-12 pt-24 text-center">
            <h1 className="mb-4 font-mono text-xs uppercase tracking-widest text-neutral-400">
              Producción audiovisual & gestión de redes sociales en Mallorca
            </h1>
            <span className="max-w-12xl text-5xl leading-tight tracking-tight text-white lg:text-7xl xl:text-8xl font-[family-name:var(--font-bebas)]">
              MIENTRAS LO PIENSAS, OTROS TE ADELANTAN
            </span>
          </div>

          <motion.div
            style={{
              position: "absolute",
              top: videoTop,
              left: videoSide,
              right: videoSide,
              bottom: videoBottom,
              borderRadius: videoRadius,
            }}
            className="z-20 overflow-hidden shadow-2xl"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              fetchPriority="high"
              className="h-full w-full object-cover"
            >
              <source src="/videos/Home-Main-Vid.webm" type="video/webm" />
              <source src="/videos/Home-Main-Vid.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </div>

      <div className="hidden flex-row justify-center gap-4 bg-black px-6 py-16 md:flex">
        <ScrollToPricing className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-200">
          CONSULTA NUESTROS PLANES
        </ScrollToPricing>
        <ScrollToContact className="rounded-full border border-white/30 bg-black/20 px-8 py-4 text-center font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black">
          ¿HABLAMOS DE TU PROYECTO?
        </ScrollToContact>
      </div>

      {/* ================= MÓVIL ================= */}
      <div className="relative md:hidden">
        {/* Envoltorio: aquí es donde vive la magia del sticky + solape.
            No hay alturas raras ni márgenes negativos: el enunciado y el
            vídeo son simplemente dos hijos normales, uno detrás de otro. */}
        <div className="relative">
          {/* Enunciado: sticky, se queda quieto arriba de la pantalla */}
          <div className="sticky top-0 z-10 flex min-h-[27vh] flex-col items-center justify-start px-6 pt-20 text-center">
            <h1 className="mb-4 font-wixui-rich-text text-xs uppercase tracking-widest text-neutral-400">
              Producción audiovisual & gestión de redes sociales en Mallorca
            </h1>
            <span className="max-w-md text-[3.85rem] leading-tight tracking-tight text-white font-[family-name:var(--font-bebas)]">
              MIENTRAS LO PIENSAS, OTROS TE ADELANTAN
            </span>

          </div>

          {/* Vídeo: justo debajo del enunciado, en flujo normal (NO sticky,
              NO margen negativo). Al llevar más z-index, según la página
              scrollea con normalidad, va subiendo y tapando al enunciado
              (que se ha quedado fijo arriba). En cuanto el vídeo lo cubre
              del todo, el enunciado se suelta solo y sigue el scroll normal. */}
          <div className="relative z-20 aspect-video w-full shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              fetchPriority="high"
              className="h-full w-full object-cover"
            >
              <source src="/videos/Home-Main-Vid.webm" type="video/webm" />
              <source src="/videos/Home-Main-Vid.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Botones: en flujo normal, justo después */}
        <div className="relative z-10 flex flex-col items-center gap-4 bg-black px-6 py-8">
          <ScrollToPricing className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-200">
            CONSULTA NUESTROS PRECIOS
          </ScrollToPricing>
          <ScrollToContact className="rounded-full border border-white/100 bg-black/20 px-8 py-4 text-center font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black">
            ¿HABLAMOS DE TU PROYECTO?
          </ScrollToContact>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollToSection from "@/components/ScrollToSection";

// El vídeo de portada (20 MB) tiene una maquetación para móvil y otra para
// escritorio. Para no descargarlo dos veces, solo se monta el <video> de la
// versión que se ve, ya en el navegador (en el HTML del servidor no hay vídeo).
const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeToViewport(callback) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
const getIsDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;
const getServerIsDesktop = () => null;

// iOS solo reproduce automáticamente un vídeo si está silenciado, con autoplay y
// playsinline. React no siempre pone el atributo "muted" en el HTML, así que
// se fuerza aquí y se llama a play() por si el autoplay no arranca solo.
function setupVideo(el) {
  if (!el) return;
  el.muted = true;
  el.defaultMuted = true;
  el.setAttribute("muted", "");
  el.play().catch(() => {});
}

// Primer fotograma del vídeo: se ve desde el primer momento y se queda si el
// móvil bloquea la reproducción automática (p. ej. modo de bajo consumo).
const POSTER = "/videos/hero-poster.jpg";

// El MP4 (H.264) va primero: lo reproduce cualquier navegador, iPhone incluido,
// y pesa la mitad que el WebM.
function HeroVideo() {
  return (
    <video ref={setupVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={POSTER}
      className="h-full w-full object-cover"
    >
      <source src="/videos/fallback/Home-Main-Vid.mp4" type="video/mp4" />
      <source src="/videos/Home-Main-Vid.webm" type="video/webm" />
    </video>
  );
}

function HeroPoster() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={POSTER}
      alt=""
      fetchPriority="high"
      className="h-full w-full object-cover"
    />
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const isDesktop = useSyncExternalStore(
    subscribeToViewport,
    getIsDesktop,
    getServerIsDesktop,
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Escritorio: el vídeo se expande hasta ocupar la pantalla al hacer scroll
  const videoTop = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"]);
  const videoSide = useTransform(scrollYProgress, [0, 0.5], ["6%", "0%"]);
  const videoBottom = useTransform(scrollYProgress, [0, 0.5], ["6%", "0%"]);
  const videoRadius = useTransform(scrollYProgress, [0, 0.5], [28, 0]);

  return (
    <section className="relative w-full bg-black">
      {/* ================= ESCRITORIO ================= */}
      <div ref={containerRef}
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
            {isDesktop === true ? <HeroVideo /> : <HeroPoster />}
          </motion.div>
        </div>
      </div>

      <div className="hidden flex-row justify-center gap-4 bg-black px-6 py-16 md:flex">
        <ScrollToSection targetId="precios" className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-200">
          CONSULTA NUESTROS PLANES
        </ScrollToSection>
        <ScrollToSection targetId="contacto" className="rounded-full border border-white/30 bg-black/20 px-8 py-4 text-center font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black">
          ¿HABLAMOS DE TU PROYECTO?
        </ScrollToSection>
      </div>

      {/* ================= MÓVIL ================= */}
      <div className="relative md:hidden">
        {/* Envoltorio: aquí es donde vive la magia del sticky + solape.
            No hay alturas raras ni márgenes negativos: el enunciado y el
            vídeo son simplemente dos hijos normales, uno detrás de otro. */}
        <div className="relative">
          {/* Enunciado: sticky, se queda quieto arriba de la pantalla */}
          <div className="sticky top-0 z-10 flex min-h-[27vh] flex-col items-center justify-start px-6 pt-20 text-center">
            <h1 className="mb-4 text-xs uppercase tracking-widest text-neutral-400">
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
            {isDesktop === false ? <HeroVideo /> : <HeroPoster />}
          </div>
        </div>

        {/* Botones: en flujo normal, justo después */}
        <div className="relative z-10 flex flex-col items-center gap-4 bg-black px-6 py-8">
          <ScrollToSection targetId="precios" className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-200">
            CONSULTA NUESTROS PRECIOS
          </ScrollToSection>
          <ScrollToSection targetId="contacto" className="rounded-full border border-white/100 bg-black/20 px-8 py-4 text-center font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black">
            ¿HABLAMOS DE TU PROYECTO?
          </ScrollToSection>
        </div>
      </div>
    </section>
  );
}
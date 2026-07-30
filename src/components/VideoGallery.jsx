"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "plyr/dist/plyr.css";
import { videos } from "@/data/videos";

// Transición física muelle
const springConfig = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.8,
};

export default function VideoGallery() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoElementRef = useRef(null);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  // Inicializar Plyr y eventos de estado (Play/Pause)
  useEffect(() => {
    if (!activeVideo || !videoElementRef.current) return;

    let isSubscribed = true;

    async function initPlyr() {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignorar
        }
        playerRef.current = null;
      }

      if (!isSubscribed) return;

      try {
        const Plyr = (await import("plyr")).default;
        if (videoElementRef.current && isSubscribed) {
          const player = new Plyr(videoElementRef.current, {
            autoplay: true,
            muted: true, // Autoplay inmediato en móviles
            controls: [
              "play-large",
              "play",
              "progress",
              "current-time",
              "mute",
              "volume",
              "fullscreen",
            ],
            fullscreen: {
              enabled: true,
              fallback: true,
              iosNative: true,
            },
          });

          playerRef.current = player;

          // Eventos para actualizar dinámicamente el badge de estado
          player.on("play", () => setIsPlaying(true));
          player.on("playing", () => setIsPlaying(true));
          player.on("pause", () => setIsPlaying(false));

          // Forzar reproducción al montar
          player.on("ready", () => {
            player.play().catch((err) => console.log("Autoplay prevent:", err));
          });

          // Manejo de pantalla completa nativa para iOS
          player.on("enterfullscreen", () => {
            const videoEl = videoElementRef.current;
            if (
              videoEl &&
              typeof videoEl.webkitEnterFullscreen === "function"
            ) {
              try {
                videoEl.webkitEnterFullscreen();
              } catch (e) {
                console.log("Fallback iOS Fullscreen:", e);
              }
            }
          });
        }
      } catch (err) {
        console.error("Error al iniciar Plyr:", err);
      }
    }

    initPlyr();

    return () => {
      isSubscribed = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignorar
        }
        playerRef.current = null;
      }
    };
  }, [activeVideo]);

  const openVideo = useCallback((videoObj) => {
    setActiveVideo(videoObj);
    setIsPlaying(true);
    setTimeout(() => {
      playerContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Manejo de URL ?videoId=
  useEffect(() => {
    const videoIdStr = searchParams.get("videoId");
    if (videoIdStr) {
      const id = parseInt(videoIdStr, 10);
      const match = videos.find((v) => v.id === id);
      if (match) {
        openVideo(match);
        router.replace("/films", { scroll: false });
      }
    }
  }, [searchParams, router, openVideo]);

  // Ordenar vídeos de mayor a menor ID
  const videosOrdenados = [...videos].sort((a, b) => b.id - a.id);

  return (
    <motion.section
      layout
      transition={springConfig}
      className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 grid-flow-dense gap-6 sm:gap-8 items-start"
    >
      {/* REPRODUCTOR */}
      <AnimatePresence mode="popLayout">
        {activeVideo && (
          <motion.div
            key="plyr-player-container"
            layout
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={springConfig}
            ref={playerContainerRef}
            className={`scroll-mt-32 bg-neutral-950/90 border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl overflow-hidden ${
              activeVideo.isVertical
                ? "sm:col-span-2 lg:col-span-4 lg:row-span-3 lg:sticky lg:top-28"
                : "sm:col-span-2 lg:col-span-12 mb-4"
            }`}
          >
            {/* CABECERA RESPONSIVE DEL REPRODUCTOR (Badge estado + Título + Botón Cerrar) */}
            <div className="flex items-center justify-between gap-3 mb-4 overflow-hidden">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors ${
                    isPlaying
                      ? "text-aux bg-aux/10 border-aux/20"
                      : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                  }`}
                >
                  {isPlaying ? "Reproduciendo" : "En pausa"}
                </span>

                {/* Título responsive que no desborda */}
                <h2 className="text-sm sm:text-base font-bold text-white truncate min-w-0 flex-1">
                  {activeVideo.fullTitle}
                </h2>
              </div>

              <button
                onClick={closeVideo}
                className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Cerrar reproductor"
              >
                ✕
              </button>
            </div>

            {/* REPRODUCTOR DE VÍDEO */}
            <div
              className={`relative w-full overflow-hidden rounded-2xl bg-black ${
                activeVideo.isVertical ? "aspect-9/16" : "aspect-video"
              }`}
            >
              <div key={activeVideo.id} className="w-full h-full">
                <video
                  ref={videoElementRef}
                  playsInline
                  controls
                  poster={activeVideo.poster}
                  className="w-full h-full object-contain bg-black"
                >
                  <source src={activeVideo.videoWebm} type="video/webm" />
                  <source src={activeVideo.videoMp4} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            {activeVideo.description && (
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TARJETAS DEL GRID */}
      {videosOrdenados.map((video) => {
        const isActive = activeVideo?.id === video.id;

        return (
          <motion.article
            key={video.id}
            layout
            transition={springConfig}
            onClick={() => openVideo(video)}
            className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl border aspect-video transition-colors duration-300 ease-out sm:col-span-1 lg:col-span-4 ${
              isActive
                ? "border-aux ring-1 ring-aux/50 opacity-60 pointer-events-none cursor-default"
                : "border-white/10 bg-neutral-900/40 cursor-pointer hover:border-white/25 hover:shadow-xl hover:shadow-black/60"
            }`}
          >
            <Image
              src={video.poster}
              alt={video.fullTitle}
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 ease-out" />

            {/* BADGE SUPERIOR: AHORA MUESTRA LA CATEGORÍA (PLACEHOLDER) */}
            {video.placeholder && (
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neutral-300 backdrop-blur-md">
                  {video.placeholder}
                </span>
              </div>
            )}

            {/* ICONO PLAY AL HACER HOVER */}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-lg">
                <svg
                  className="h-5 w-5 translate-x-0.5 fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* TEXTOS INFERIORES: TÍTULO + LUGAR Y FECHA */}
            <div className="relative z-10 p-4">
              <h3 className="text-sm font-bold text-white tracking-wide truncate group-hover:text-aux transition-colors">
                {video.fullTitle}
              </h3>
              {(video.lugar || video.fecha) && (
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {video.lugar} {video.lugar && video.fecha ? "·" : ""}{" "}
                  {video.fecha}
                </p>
              )}
            </div>

            <script type="application/ld+json" suppressHydrationWarning>
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "VideoObject",
                name: video.fullTitle,
                description: video.description,
                thumbnailUrl: video.poster,
                uploadDate: `${video.fecha}-01-01T00:00:00+01:00`,
                contentUrl: video.videoWebm,
              })}
            </script>
          </motion.article>
        );
      })}
    </motion.section>
  );
}

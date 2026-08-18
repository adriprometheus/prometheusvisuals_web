"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fotos } from "@/data/fotos";

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fotosOrdenadas = useMemo(
  () => [...fotos].sort((a, b) => b.id - a.id),
  [],
);

  const openModal = useCallback((index) => {
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setCurrentIndex(null);
    document.body.style.overflow = "";
  }, []);

  const showPrev = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? fotosOrdenadas.length - 1 : prev - 1,
    );
  }, [fotosOrdenadas.length]);

    const showNext = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) =>
      prev === fotosOrdenadas.length - 1 ? 0 : prev + 1,
    );
  }, [fotosOrdenadas.length]);

  // Apertura desde URL (?fotoId=...)
    useEffect(() => {
    const fotoIdStr = searchParams.get("fotoId");
    if (fotoIdStr) {
      const id = parseInt(fotoIdStr, 10);
      const index = fotosOrdenadas.findIndex((f) => f.id === id);
      if (index !== -1) {
        // Lectura intencional de la URL al cargar para abrir el modal correspondiente
        // eslint-disable-next-line react-hooks/set-state-in-effect
        openModal(index);
        router.replace("/proyectos", { scroll: false });
      }
    }
  }, [searchParams, openModal, router, fotosOrdenadas]);

  // Teclado
  useEffect(() => {
    function onKey(e) {
      if (currentIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeModal, showNext, showPrev, currentIndex]);

  // Swipe táctil
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  };

  const currentFoto =
    currentIndex !== null ? fotosOrdenadas[currentIndex] : null;

  // Precarga
  const nextIndex =
    currentIndex !== null ? (currentIndex + 1) % fotosOrdenadas.length : null;
  const prevIndex =
    currentIndex !== null
      ? (currentIndex - 1 + fotosOrdenadas.length) % fotosOrdenadas.length
      : null;

  return (
    <>
      {/* Grid de Galería */}
      <section className="columns-3 gap-3 px-4 lg:columns-4 xl:columns-5">
        {fotosOrdenadas.map((foto, index) => {
          const isPriority = index < 6;
          return (
            <div
              key={foto.id}
              className="relative mb-3 block break-inside-avoid overflow-hidden rounded-lg cursor-zoom-in"
              onClick={() => openModal(index)}
              onKeyDown={(e) => e.key === "Enter" && openModal(index)}
              tabIndex={0}
            >
              <Image
                src={`/fotos/expo(${foto.id}).webp`}
                alt={foto.alt || `Exposición número ${foto.id}`}
                width={foto.width}
                height={foto.height}
                sizes="(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                priority={isPriority}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          );
        })}
      </section>

      {/* Modal / Lightbox */}
      {currentFoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-300 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md select-none animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* BOTÓN CERRAR - Siempre arriba a la derecha */}
          <button
            onClick={closeModal}
            aria-label="Cerrar modal"
            className="cursor-pointer absolute right-4 top-4 z-310 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg transition-all hover:bg-white/20 active:scale-90"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* FLECHAS PANTALLAS GRANDES (2XL+) - Flotando a los lados */}
          <button
            onClick={showPrev}
            className="hidden 2xl:flex cursor-pointer absolute left-6 top-1/2 -translate-y-1/2 z-30 h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={showNext}
            className="hidden 2xl:flex cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 z-30 h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* ÁREA DE IMAGEN - Maximizada */}
          <div className="flex h-full w-full flex-1 items-center justify-center p-2 sm:p-6 md:p-8 overflow-hidden">
            <Image
              src={`/fotos/expo(${currentFoto.id}).webp`}
              alt={
                currentFoto.descripcion ||
                currentFoto.alt ||
                "Imagen de la galería"
              }
              width={currentFoto.width}
              height={currentFoto.height}
              sizes="100vw"
              priority
              className="h-full w-auto max-h-full max-w-full rounded-md object-contain shadow-2xl transition-all duration-300"
            />
          </div>

          {/* PIE DE MODAL (HASTA PANTALLAS 2XL + MANTENIDO EN PANTALLAS GRANDES) */}
          <div className="w-full max-w-4xl px-6 pb-8 md:pb-10 z-40">
            <div className="flex items-center justify-between gap-4">
              {/* Flecha Anterior (Hasta 2XL) */}
              <button
                onClick={showPrev}
                className="flex 2xl:hidden cursor-pointer h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Descripción - Centrada y adaptable */}
              <div className="flex-1 text-center">
                <p className="text-sm md:text-base font-light text-auxwhite/90 tracking-wide leading-relaxed drop-shadow-md">
                  {currentFoto.descripcion ||
                    `Exposición número ${currentFoto.id}`}
                </p>
              </div>

              {/* Flecha Siguiente (Hasta 2XL) */}
              <button
                onClick={showNext}
                className="flex 2xl:hidden cursor-pointer h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* PRECARGA SILENCIOSA */}
          {nextIndex !== null && (
            <div className="hidden" aria-hidden="true">
              <Image
                src={`/fotos/expo(${fotosOrdenadas[nextIndex].id}).webp`}
                alt=""
                width={10}
                height={10}
                priority
              />
            </div>
          )}
          {prevIndex !== null && (
            <div className="hidden" aria-hidden="true">
              <Image
                src={`/fotos/expo(${fotosOrdenadas[prevIndex].id}).webp`}
                alt=""
                width={10}
                height={10}
                priority
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

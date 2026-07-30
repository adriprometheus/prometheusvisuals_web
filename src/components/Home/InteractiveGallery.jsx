"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Importaciones de datos reales de tu galería
import { fotos } from "@/data/fotos";
import { videos } from "@/data/videos";

export default function InteractiveGallery() {
  const [activeTab, setActiveTab] = useState("fotos");

  // Filtramos las 6 primeras fotos y vídeos para el boceto interactivo
  const fotosOrdenadas = [...fotos].sort((a, b) => b.id - a.id); // Orden descendente por ID (más recientes primero)
  const previewPhotos = fotosOrdenadas.slice(0, 6);
  const videosOrdenados = [...videos].sort((a, b) => b.id - a.id);
  const previewVideos = videosOrdenados.slice(0, 6);

  return (
    <section className="bg-neutral-950/40 border-y border-white/5 py-10 sm:py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
              NUESTRO ARTE
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              PORFOLIO RECIENTE
            </h2>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex gap-2 bg-neutral-900/60 p-1 rounded-full border border-white/5">
            <button
              onClick={() => setActiveTab("fotos")}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "fotos"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Fotografía
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "videos"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Vídeos / Reels
            </button>
          </div>
        </div>

        {/* Grid Responsivo */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {activeTab === "fotos"
            ? previewPhotos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/proyectos?fotoId=${photo.id}`}
                  className="relative aspect-4/5 bg-neutral-900 rounded-2xl overflow-hidden group border border-white/5"
                >
                  <Image
                    src={`/fotos/expo(${photo.id}).webp`}
                    alt={`Prometheus Photo ${photo.id}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </Link>
              ))
            : previewVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/films?videoId=${video.id}`}
                  className="relative aspect-16/10 bg-neutral-900 rounded-2xl overflow-hidden group border border-white/5 flex flex-col justify-end p-4"
                >
                  <Image
                    src={video.poster}
                    alt={video.fullTitle}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                      {video.placeholder}
                    </span>
                    <h4 className="text-xs font-semibold text-white mt-1.5 truncate">
                      {video.fullTitle}
                    </h4>
                  </div>
                </Link>
              ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href={activeTab === "fotos" ? "/proyectos" : "/films"}
            className="text-xs font-medium tracking-widest text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
          >
            VER PORTFOLIO COMPLETO <span className="text-neutral-600">✦</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";

export default function WorkerCard({ member, className = "" }) {
  return (
    <div
      className={`bg-neutral-900/60 rounded-3xl border-2 border-white/100 p-6 flex flex-col items-center text-center shadow-lg shadow-white/30 hover:bg-neutral-900/90 hover:border-white/70 hover:shadow-white/20 transition-all duration-300 ${className}`}
    >
      {/* Contenedor de imágenes con efecto Hover */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 group cursor-pointer shadow-lg bg-neutral-800">
        <Image
          src={member.imageDefault}
          alt={member.name}
          fill
          sizes="112px"
          quality={85}
          className="object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
        />
        <Image
          src={member.imageHover}
          alt={`${member.name} - Hover`}
          fill
          sizes="112px"
          quality={85}
          className="object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
        />
      </div>

      <h3 className="text-lg font-bold text-white">{member.name}</h3>
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
        {member.role}
      </p>

      <div className="w-full border-t border-neutral-800/60 my-2"></div>

      <div className="space-y-1.5 text-xs text-neutral-400 w-full">
        <p>
          <span className="text-neutral-600 font-medium">Email: </span>
          <a
            href={`mailto:${member.email}`}
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            {member.email}
          </a>
        </p>
        <p>
          <span className="text-neutral-600 font-medium">Tel: </span>
          <a
            href={`tel:${member.phone}`}
            className="hover:text-white transition-colors"
          >
            {member.phone}
          </a>
        </p>
        <p>
          <span className="text-neutral-600 font-medium">Desde: </span>
          <span className="text-neutral-300 font-medium">
            {member.location}
          </span>
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-1">
          {member.languages.map((lang, idx) => (
            <span
              key={idx}
              className="bg-neutral-800 text-neutral-300 text-[10px] px-2.5 py-1 rounded-full font-medium"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";

export default function SuccessCase() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Info Izquierda */}
        <div className="lg:col-span-7">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
            UN CASO REAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-6">
            Benditas Cookies
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            De la idea al mostrador. Diseñamos un despliegue de identidad y
            reels gastronómicos que despertaron antojos en toda la isla. Unimos
            contenido estético, storytelling y publicidad para catapultar su
            presencia.
          </p>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-6 mb-8 border-t border-white/5 pt-6">
            <div>
              <span className="block text-3xl font-bold text-white">16K+</span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">
                Seguidores en meses
              </span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-white">
                Orgánico
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">
                Crecimiento real
              </span>
            </div>
          </div>

          {/* Cita/Testimonio */}
          <blockquote className="border-l-2 border-neutral-700 pl-4 italic text-sm text-neutral-300">
            &ldquo;El equipo de Prometheus no solo entendió el sabor de Benditas
            Cookies, sino que lograron transmitir su textura y olor a través de
            la pantalla. Son unos magos.&rdquo;
          </blockquote>
        </div>

        {/* Imagen/Contenido Derecha */}
        <div className="lg:col-span-5 relative aspect-4/5 rounded-4xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
          <Image
            src="/fotos/proyecto-destacado-benditas-home.webp"
            alt="Caso de éxito Benditas Cookies"
            fill
            className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}

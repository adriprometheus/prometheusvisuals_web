import Link from "next/link";

export default function ServicesMenu() {
  return (
    <section className="bg-neutral-950/40 border-y border-white/5 py-5 sm:py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-1xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            QUÉ PODEMOS HACER POR TI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1 */}
          <div className="bg-white/5 backdrop-blur-lg border border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40">
            <div>
              <span className="text-xs font-mono text-neutral-500">
                01 / PRODUCCIÓN
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-4">
                Producción audiovisual
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Producimos contenido que hace que la gente deje de hacer scroll
                y empiece a prestar atención.
              </p>
            </div>
            <Link
              href="/servicios/#produccion-audiovisual"
              className="mt-8 text-xs font-medium text-white hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              Saber más <span className="text-neutral-500">→</span>
            </Link>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white/5 backdrop-blur-lg border border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40">
            <div>
              <span className="text-xs font-mono text-neutral-500">
                02 / REDES SOCIALES
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-4">
                Gestión de Redes Sociales
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Planificamos y gestionamos el contenido de tus redes sociales
                para aumentar tu visibilidad, fortalecer tu marca y generar una
                comunidad activa.
              </p>
            </div>
            <Link
              href="/servicios/#gestion-redes-sociales"
              className="mt-8 text-xs font-medium text-white hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              Saber más <span className="text-neutral-500">→</span>
            </Link>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white/5 backdrop-blur-lg border border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40">
            <div>
              <span className="text-xs font-mono text-neutral-500">
                03 / PUBLI & ADS
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-4">
                Campañas Meta Ads
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Con Meta Ads hacemos que tus clientes
                ideales encuentren tu marca antes que a la competencia.
              </p>
            </div>
            <Link
              href="/servicios/#meta-ads-conversion"
              className="mt-8 text-xs font-medium text-white hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              Saber más <span className="text-neutral-500">→</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-12">
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

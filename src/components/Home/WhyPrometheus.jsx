export default function WhyPrometheus() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          NUESTRA FILOSOFÍA
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          Estrategia, calidad cinematográfica y resultados medibles.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bloque 1: Enfoque en Ventas */}
        <div className="group relative bg-neutral-900/30 backdrop-blur-md border border-white/5 rounded-4xl p-8 sm:p-10 transition-all duration-500 hover:border-white/10 hover:bg-neutral-900/50">
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white border border-white/10 shadow-lg">
            {/* SVG Target / Objetivos */}
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4 mt-2">
            Enfoque estratégico y conversión
          </h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            No nos limitamos a crear imágenes estéticas. Realizamos
            pre-producción con análisis de marca y guiones técnicos orientados a
            conectar emocionalmente y convertir espectadores en clientes.
          </p>
        </div>

        {/* Bloque 2: Gestión 360° */}
        <div className="group relative bg-neutral-900/30 backdrop-blur-md border border-white/5 rounded-4xl p-8 sm:p-10 transition-all duration-500 hover:border-white/10 hover:bg-neutral-900/50">
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white border border-white/10 shadow-lg">
            {/* SVG Video / Cámara Cinematográfica */}
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4 mt-2">
            Producción audiovisual integral en Mallorca
          </h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            Rodajes presenciales con equipos cinematográficos Sony Alpha,
            grabación multicámara, etalonaje profesional y optimización para
            captar la esencia de tu negocio.
          </p>
        </div>
      </div>
    </section>
  );
}

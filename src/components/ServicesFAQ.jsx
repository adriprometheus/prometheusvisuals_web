export default function ServicesFAQ() {
  const faqs = [
    {
      q: "¿En qué zonas de Mallorca realizáis las grabaciones y sesiones de fotos?",
      a: "Ofrecemos cobertura presencial en toda la isla de Mallorca (Palma, Calvià, Alcúdia, Manacor, etc.). Contamos con equipo propio de rodaje para desplazarnos hasta las instalaciones de tu empresa.",
    },
    {
      q: "¿Cómo funcionan las sesiones de rodaje mensuales?",
      a: "Planificamos los guiones y shots técnicos con antelación. En función del paquete elegido (Pack Creativo o Pack Prometheus), coordinamos jornadas de rodaje de 2 a 4 horas al mes para capturar todo el contenido crudo en un solo día sin interrumpir tu actividad comercial.",
    },
    {
      q: "¿Existe compromiso de permanencia en los servicios de gestión de redes?",
      a: "Establecemos un periodo inicial de 6 meses para garantizar la correcta optimización de los algoritmos de redes sociales, estabilizar la entrega de contenido y medir retornos reales en ventas.",
    },
    {
      q: "¿Incluye la gestión de la inversión publicitaria en Meta Ads?",
      a: "Sí, en el Pack Prometheus asumimos la configuración técnica, diseño de anuncios y optimización diaria de Meta Ads, incluyendo una partida inicial de inversión publicitaria dentro del fee mensual.",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          DUDAS HABITUALES
        </span>
        <h2 className="text-2xl font-bold text-white mt-2">
          PREGUNTAS FRECUENTES SOBRE NUESTROS SERVICIOS
        </h2>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-neutral-900/30 border border-white/5 rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-base font-semibold text-white mb-3">{faq.q}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

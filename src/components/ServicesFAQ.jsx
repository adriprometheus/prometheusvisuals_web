import { faqs } from "@/data/faqs";

export default function ServicesFAQ() {
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
        {faqs.map((faq) => (
          <div
            key={faq.q}
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

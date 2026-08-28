import Link from "next/link";
import ScrollToContact from "@/components/ScrollToContact";
import { plans } from "@/data/plans";

const accentStyles = {
  orange: {
    card: "bg-gradient-to-b from-orange-950/60 to-neutral-900/80 border-orange-500/40 shadow-2xl shadow-orange-900/50 ring-1 ring-orange-500/20",
    badge: "bg-orange-500",
  },
  green: {
    card: "bg-gradient-to-b from-green-950/60 to-neutral-900/80 border-green-500/40 shadow-2xl shadow-green-900/50 ring-1 ring-green-500/20",
    badge: "bg-green-500",
  },
};

export default function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-6 py-10 sm:py-10">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          TARIFAS Y PLANES
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          INVERSIÓN ADAPTADA A LOS OBJETIVOS DE TU NEGOCIO
        </h2>
        <p className="text-sm text-neutral-400 mt-3 max-w-xl mx-auto">
          Planes operativos recurrentes pensados para maximizar la calidad
          estética o escalar tus ventas mediante publicidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-4xl p-8 sm:p-10 flex flex-col justify-between border transition-all duration-300 ${
              plan.accent
                ? accentStyles[plan.accent].card
                : "bg-gradient-to-b from-white-20/60 to-neutral-900/80 border-white-500/100 shadow-2xl shadow-white-900/100 ring-1 ring-white-500/20"
            }`}
          >
            {plan.badge && (
              <span
                className={`absolute -top-3 right-8 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${accentStyles[plan.accent].badge}`}
              >
                Más popular
              </span>
            )}

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                {plan.target}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">
                {plan.name}
              </h3>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                {plan.description}
              </p>

              {/* Sección de Precio con "Desde" */}
              <div className="mb-8 border-b border-white/5 pb-6">
                <div className="flex items-baseline gap-2">
                </div>
              </div>

              <ul className="space-y-4 text-xs text-neutral-300 mb-8">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-white shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <ScrollToContact
                className={`block w-full py-3.5 px-6 rounded-full text-center text-xs font-semibold tracking-wider transition-all duration-300 ${
                  plan.accent
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "border border-white/100 text-white hover:bg-white/10"
                }`}
              >
                SOLICITAR PLAN
              </ScrollToContact>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/servicios"
          className="text-xs font-medium text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
        >
          Ver desglose detallado y condiciones de los servicios →
        </Link>
      </div>
    </section>
  );
}

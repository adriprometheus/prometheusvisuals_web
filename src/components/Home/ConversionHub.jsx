import BookingCalendar from "@/components/BookingCalendar";
import ContactForm from "@/components/ContactForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { site } from "@/lib/site";

export default function ConversionHub() {
  return (
    <section id="contacto" className="mx-auto max-w-5xl px-6 py-10 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
        {/* Mensajes rápidos */}
        <div className="lg:col-span-12 flex flex-col justify-between">
          <div className="mx-auto max-w-md text-center">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
              ¿CONECTAMOS?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2 mb-4">
              HABLEMOS DE TU PROYECTO
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed mb-8 text-justify">
              Cuéntanos qué tienes en mente y te propondremos una estrategia
              visual adaptada a tu marca en menos de 24 horas.
            </p>

            {/* Accesos Rápidos */}
            <div className="space-y-4">
              <a href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-xs">
                  <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                </span>
                Chat rápido de WhatsApp
              </a>
              <a href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-xs">
                  <InstagramIcon gradientId="igGlowHub" filled className="w-4 h-4" />
                </span>
                Escríbenos por Instagram DM
              </a>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 border-t border-white/5 pt-8" />
        </div>

        <div className="lg:col-span-12">
          <BookingCalendar />

          {/* Separador sutil entre el calendario y el formulario */}
          <div className="my-20 flex items-center justify-center gap-4">
            <div className="h-px bg-white/5 grow" />
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              o si lo prefieres
            </span>
            <div className="h-px bg-white/5 grow" />
          </div>
        </div>
        {/* Formulario de contacto */}
        <div className="lg:col-span-12 bg-neutral-900/20 text-center backdrop-blur-md border border-white/5 rounded-[40px] p-6 sm:p-10 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">
            SOLICITA UN PRESUPUESTO
          </h3>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
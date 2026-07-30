import Link from "next/link";
import BookingCalendar from "@/components/BookingCalendar";

export const metadata = {
  title: "Formulario enviado",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <main className="mt-navbar mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
          <div className="flex items-center justify-center">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            ¡RECIBIDO CON ÉXITO!
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Gracias por escribirnos y confiar en Prometheus. Hemos registrado
            tus datos de contacto de forma segura. Nuestro equipo ya se
            encuentra revisando tu propuesta y en muy poco tiempo nos pondremos
            en contacto contigo para empezar a dar forma a tus ideas.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-secnd px-8 py-3.5 text-sm font-semibold tracking-wider text-main transition-all duration-300 hover:bg-boldhover hover:text-secnd hover:shadow-lg focus:outline-none"
            >
              DESCUBRE NUESTRAS HISTORIAS
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-neutral-900/40 p-6 backdrop-blur-xl sm:p-8 lg:col-span-5">
          <div className="mb-2 inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-aux">
            Siguiente paso
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿YA HAS RESERVADO TU CITA?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-auxwhite">
            Acelera el proceso agendando directamente una sesión de consultoría
            virtual con nosotros mientras revisamos tu formulario.
          </p>
        </div>
      </section>

      <section className="mt-12 w-full border-t border-white/10 pt-10">
        <BookingCalendar />
      </section>
    </main>
  );
}

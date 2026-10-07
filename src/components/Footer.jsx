import { CookiePreferencesButton } from "@/components/CookieConsent";
import { InstagramIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center bg-main">
      <div className="my-8 mb-12 flex h-[6vh] w-[min(20vw,220px)] items-center justify-around gap-6">
        <a aria-label="Visita nuestra página de Instagram"
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full aspect-square items-center justify-center"
        >
          <InstagramIcon
            gradientId="igGlow"
            className="h-full transition-all duration-300 fill-secnd hover:fill-[url(#igGlow)]"
          />
        </a>
        <a aria-label="Contacta con nosotros a través de WhatsApp"
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full aspect-square items-center justify-center"
        >
          <WhatsAppIcon className="h-full fill-secnd hover:fill-[#25D366]" />
        </a>
      </div>

      <div className="mt-24 h-[20vh] w-full overflow-hidden">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-nowrap" aria-hidden={i > 0}>
              {Array.from({ length: 6 }).map((_, j) => (
                <p key={j} className="pr-12 text-h1 font-black italic">
                  PROMETHEUS.VISUALS
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <CookiePreferencesButton className="mb-3 cursor-pointer text-legal text-auxwhite underline hover:text-secnd" />

      <p className="relative flex justify-center pb-8 after:absolute after:bottom-7 after:h-0.5 after:w-[90%] after:bg-secnd text-legal">
        Todos los derechos © {new Date().getFullYear()} Prometheus Visuals
      </p>
    </footer>
  );
}
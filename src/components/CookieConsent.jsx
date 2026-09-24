"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";

// ID de Google Ads (antes estaba escrito a mano en layout.js)
const GOOGLE_ADS_ID = "AW-18404658605";

const STORAGE_KEY = "cookie-consent"; // valores: "granted" | "denied"
const CHANGE_EVENT = "cookie-consent-change";
const OPEN_EVENT = "open-cookie-preferences";

// --- Lectura del consentimiento guardado (sin errores de hidratación) ---
function subscribe(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "unset";
  } catch {
    return "unset";
  }
}
// En el servidor no sabemos qué eligió el usuario: no pintamos nada.
function getServerSnapshot() {
  return "loading";
}

// Botón para el footer: permite cambiar la decisión en cualquier momento.
export function CookiePreferencesButton({ className }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Preferencias de cookies
    </button>
  );
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  function choose(value) {
    const previous = consent;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Si el navegador bloquea localStorage, simplemente no se recuerda.
    }
    setReopened(false);
    window.dispatchEvent(new Event(CHANGE_EVENT));

    // Si retira un consentimiento que ya había dado, recargamos para que
    // Google deje de cargarse en esta sesión.
    if (previous === "granted" && value === "denied") {
      window.location.reload();
    }
  }

  const showBanner = consent === "unset" || (consent !== "loading" && reopened);

  return (
    <>
      {/* Google Ads SOLO se carga si el usuario ha aceptado. */}
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
              });
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ADS_ID}');
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Preferencias de cookies"
          className="fixed inset-x-4 bottom-4 z-200 mx-auto max-w-xl rounded-2xl border border-white/10 bg-black/95 p-5 text-secnd shadow-2xl backdrop-blur-md"
        >
          <p className="text-sm leading-relaxed text-neutral-300">
            Usamos cookies de Google Ads para medir la eficacia de nuestros
            anuncios. Puedes aceptarlas o rechazarlas: la web funciona igual en
            ambos casos.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="flex-1 cursor-pointer rounded-full border border-white/30 px-6 py-3 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              RECHAZAR
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="flex-1 cursor-pointer rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition-colors hover:bg-neutral-200"
            >
              ACEPTAR
            </button>
          </div>
        </div>
      )}
    </>
  );
}
const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy: lista de los únicos sitios desde los que el
// navegador puede cargar cosas en esta web. Si un día añades algo de fuera
// (otra analítica, un mapa, un chat...), añade su dominio aquí o se bloqueará.
//  - Google Ads (gtag): solo se carga si el usuario acepta las cookies.
//  - cdn.plyr.io: iconos del reproductor de vídeo de /films.
//  - vercel.live: barra de comentarios de Vercel en las previews.
// 'unsafe-inline' en scripts lo necesita Next.js para hidratar la página y el
// gtag en línea; 'unsafe-eval' solo en desarrollo.
const google =
  "https://*.google.com https://*.google.es https://*.googletagmanager.com https://*.googleadservices.com https://*.doubleclick.net https://*.googlesyndication.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${google} https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${google} https://cdn.plyr.io https://vercel.com https://vercel.live`,
  "font-src 'self' https://vercel.live",
  "media-src 'self' blob: https://cdn.plyr.io",
  `connect-src 'self'${isDev ? " ws: wss:" : ""} ${google} https://cdn.plyr.io https://vercel.live wss://ws-us3.pusher.com`,
  `frame-src ${google} https://vercel.live`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Solo HTTPS durante 2 años, también en subdominios.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Nadie puede meter la web dentro de un iframe (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No anunciar "X-Powered-By: Next.js" a cualquiera que mire las cabeceras.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["192.168.1.57"],
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Las respuestas de la API nunca se guardan en caché (datos personales).
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        // Fotos, vídeos y logos de /public: caché larga en el navegador.
        source: "/:dir(fotos|videos|logos)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;

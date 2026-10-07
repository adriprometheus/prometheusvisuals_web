# Prometheus Visuals — prometheusvisuals.com

Web de la agencia audiovisual Prometheus Visuals (Mallorca), hecha con
**Next.js 16 (App Router)**, **React 19** y **Tailwind CSS 4**. Incluye un
formulario de contacto que envía emails con **Resend** y un calendario de
reservas conectado a **Google Calendar** (con enlace de Google Meet).
Se publica en **Vercel**.

## Puesta en marcha

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # compilación de producción
npm run lint
```

## Variables de entorno (`.env.local` y en Vercel)

| Variable | Para qué |
| --- | --- |
| `RESEND_API_KEY` | Envío de emails (contacto y reservas) |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | Destino y remitente del formulario de contacto |
| `BOOKING_FROM_EMAIL` / `COMPANY_EMAIL` | Remitente de las confirmaciones y a quién avisar de cada reserva |
| `COMPANY_NAME`, `COMPANY_LOGO_URL` | Opcionales: firma y logo de los emails de reserva |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` | OAuth de la cuenta de Google del calendario |
| `GOOGLE_CALENDAR_ID` | Opcional, por defecto `primary` |

Nunca se suben a git (`.gitignore` ya los excluye).

## Estructura

```
src/
├── app/
│   ├── layout.js            # <head> global: SEO, datos estructurados, fuentes, Navbar/Footer
│   ├── page.js              # Home
│   ├── servicios/ films/ proyectos/ about/ contacto/ gracias/
│   ├── api/contact          # POST: valida (zod) y envía el formulario por email
│   ├── api/booking          # GET: huecos libres · POST: crea la reunión en Calendar
│   ├── opengraph-image.jpg  # Imagen al compartir el enlace (WhatsApp, LinkedIn…)
│   ├── twitter-image.jpg    # La misma imagen para X
│   ├── favicon.ico, icon.png, apple-icon.png
│   ├── manifest.js, robots.js, sitemap.js
├── components/              # Secciones y piezas de la interfaz
├── data/                    # Textos y listas: servicios, planes, FAQ, fotos, vídeos, clientes…
└── lib/
    ├── site.js              # Datos de la empresa para SEO (URL, email, teléfono, redes…)
    ├── apiGuard.js          # Límite de envíos, origen y tamaño de las peticiones a la API
    ├── contactSchema.js / bookingSchema.js   # Validación en servidor
    ├── schedule.js          # Días y horas reservables (miércoles y viernes)
    ├── googleCalendar.js    # Disponibilidad y creación de eventos
    └── email.js / bookingEmail.js            # Plantillas de email
branding/                    # Logo original en alta resolución (no se publica)
```

## Dónde se cambia cada cosa

- **Datos de la empresa** (email, teléfono, Instagram, descripción para
  Google): `src/lib/site.js`.
- **Título y descripción de cada página**: el `pageMetadata({...})` al
  principio de cada `page.js`.
- **Horario de reservas**: `src/lib/schedule.js`.
- **Fotos de la galería**: `public/fotos/expo(N).webp` + su entrada en
  `src/data/fotos.js`. **Vídeos**: `public/videos/expo-N.webm`,
  `public/videos/fallback/expo-N.mp4` + su entrada en `src/data/videos.js`.
- **Imagen al compartir el enlace**: sustituye `src/app/opengraph-image.jpg`
  y `twitter-image.jpg` (1200×630).

## Seguridad

- Cabeceras HTTP en `next.config.mjs`: Content-Security-Policy, HSTS,
  protección contra iframes (clickjacking), `nosniff`, Referrer-Policy y
  Permissions-Policy. Si añades un servicio externo (otra analítica, un
  mapa, un chat…), añade su dominio a la CSP o el navegador lo bloqueará.
- La API solo acepta JSON enviado desde la propia web, limita el tamaño del
  mensaje y el número de envíos por IP, valida todo con zod y tiene un campo
  trampa (honeypot) contra bots.
- Google Ads solo se carga si el visitante acepta las cookies.

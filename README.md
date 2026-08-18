# Prometheus Visuals — Next.js

Migración del sitio estático original (HTML + CSS + JS vanilla) a **Next.js
14 (App Router)** con **Tailwind CSS** y backend real para el formulario de
contacto y el calendario de reservas.

## 1. Estructura de `src/`

```
src/
├── app/
│   ├── layout.js              # Layout raíz: fuentes (next/font), metadata SEO global, Navbar/Footer
│   ├── globals.css            # @tailwind + capa "components" para animaciones/efectos complejos
│   ├── page.js                # Home ("/")
│   ├── not-found.js           # 404 personalizada
│   ├── robots.js              # /robots.txt generado
│   ├── sitemap.js             # /sitemap.xml generado
│   ├── contacto/page.js       # "/contacto"
│   ├── proyectos/page.js      # "/proyectos" (galería de fotos)
│   ├── films/page.js          # "/films" (galería de vídeos)
│   ├── gracias/page.js        # "/gracias" (post-envío de formulario)
│   └── api/
│       ├── contact/route.js   # POST — valida y envía el formulario de contacto (Resend)
│       └── booking/route.js   # GET/POST — disponibilidad y confirmación de reservas
│
├── components/
│   ├── Navbar.jsx              # Client component, menú hamburguesa con useState
│   ├── Footer.jsx
│   ├── AboutUs.jsx             # Sección "Somos Prometheus" (hover fotos Marc/Jordi)
│   ├── HomeProjects.jsx        # Proyectos destacados en Home
│   ├── ClientsSlider.jsx       # Marquee de logos con drag/inercia (client component)
│   ├── BookingCalendar.jsx     # Calendario + modal de reserva, consume /api/booking
│   ├── ContactForm.jsx         # Formulario multi-paso, consume /api/contact
│   ├── Gallery.jsx        # Galería masonry + modal ampliado
│   └── VideoGallery.jsx        # Grid de vídeos + modal de reproducción
│
├── data/
│   ├── fotos.js                # Generado a partir de tu fotos.json original
│   ├── videos.js                # Generado a partir de los data-attributes de films.html
│   ├── clients.js
│   ├── countryCodes.js
│   └── homeProjects.js
│
└── lib/
    ├── contactSchema.js         # Validación del formulario con zod
    └── email.js                 # Envío de email con Resend
```

## 2. Instalación

```bash
npm install
cp .env.local.example .env.local   # y rellena las claves reales
npm run dev
```

Abre `http://localhost:3000`.

## 3. Backend del formulario de contacto

- El formulario (`ContactForm.jsx`) hace `fetch("/api/contact", { method: "POST" })`.
- `src/app/api/contact/route.js` valida el body con **zod** (`lib/contactSchema.js`)
  y, si es válido, envía un email de notificación con **Resend**
  (`lib/email.js`). Si `RESEND_API_KEY` no está configurada, el envío se
  omite y se hace `console.warn` (para poder desarrollar sin credenciales).
- Si el email se envía correctamente, el cliente redirige a `/gracias`
  mediante `router.push`, igual que hacía el `action="gracias.html"` original,
  pero sin recargar la página ni depender de un `<form action>` estático.
- **Pendiente de decidir por ti**: si además de notificarte por email quieres
  guardar los leads en una base de datos, añade la llamada correspondiente
  donde se indica con `// TODO` en `api/contact/route.js`.

## 4. Backend del calendario de reservas

`api/booking/route.js` expone:

- `GET /api/booking?date=YYYY-MM-DD` → horas disponibles para ese día
  (actualmente **simuladas** de forma determinista, igual que el
  `mockHours` + `Math.random()` del `calendar.js` original, pero ahora vive
  en el servidor).
- `POST /api/booking` `{ date, time }` → confirma la reserva.

Para producción, sustituye la simulación por una consulta real (base de
datos, Google Calendar, Cal.com, etc.) donde se indica con `// TODO`.

## 5. CSS → Tailwind

Se ha migrado todo el `styles.css` (~2000 líneas) a **utilidades de
Tailwind** directamente en el JSX de cada componente, usando los design
tokens del CSS original (colores, tamaños de fuente, `--navbarsize`, etc.)
como `theme.extend` en `tailwind.config.js`.

Las piezas que dependen de `@keyframes`, pseudo-elementos (`::after`) o
selectores como `peer` que Tailwind no resuelve solo con clases utilitarias
en línea se han agrupado en `globals.css` dentro de `@layer components`
(p.ej. `.nav-link`, `.image-effect`, `.marquee-track`, `.checkmark`,
`.form-input-group`, `.calendar-day`). Esto es una práctica estándar en
proyectos Tailwind reales: utilidades para el 95% del layout + un puñado de
clases de componente para animaciones reutilizables — no una renuncia a
Tailwind, sino cómo se usa en producción.

## 6. Cambios de comportamiento relevantes respecto al sitio original

- El menú hamburguesa ya no usa el truco `<input type="checkbox">` + CSS;
  ahora es un `useState` en `Navbar.jsx` (más idiomático en React/Next).
- La galería de vídeos (`films.html` + `galeria-videos.js`) tenía una
  coreografía de animación de layout muy específica en JS puro ("teatro",
  con Plyr). Se ha sustituido por un modal centrado con `<video>` nativo
  controlado por React (`VideoGallery.jsx`): misma experiencia de usuario
  (clic en miniatura → reproducción ampliada con detalles), con muchísimo
  menos código imperativo y sin dependencia externa de Plyr. Si quieres
  recuperar exactamente la animación de "teatro" original, es reutilizable
  como efecto adicional sobre este mismo componente.
- Las imágenes usan `next/image` donde el tamaño es fijo y conocido
  (fotos de equipo, proyectos destacados) para aprovechar la optimización
  automática de Next.js; la galería masonry y el grid de vídeos siguen
  usando `<img>`/`<picture>` con tus `srcset` AVIF/WebP originales porque
  ya traían su propia estrategia de responsive images.

## 7. Assets

Copia tu carpeta `Media/` (fotos, vídeos, logos) tal cual dentro de
`public/Media/` — las rutas usadas en el código (`/Media/...`) coinciden
exactamente con las del sitio original.

## 8. Pendiente / recomendaciones

- Añadir rate limiting a `/api/contact` (p.ej. con Upstash) para evitar spam.
- Sustituir la disponibilidad simulada de `/api/booking` por una fuente real.
- Verificar el dominio de envío en Resend para que `CONTACT_FROM_EMAIL`
  funcione en producción.
- Revisar que todos los `alt` y metadatos de vídeo/SEO de `data/videos.js`
  y `data/fotos.js` sigan encajando si añades o quitas contenido.
/**
 * Tailwind v4 ya no necesita "tailwindcss" + "autoprefixer" por separado:
 * @tailwindcss/postcss incluye el prefijado de vendors internamente
 * (vía Lightning CSS).
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
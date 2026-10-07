import { site } from "@/lib/site";

// Permite "Añadir a pantalla de inicio" con el logo y el nombre correctos.
export default function manifest() {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: site.themeColor,
    theme_color: site.themeColor,
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

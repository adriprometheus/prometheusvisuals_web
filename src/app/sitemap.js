const BASE_URL = "https://www.prometheusvisuals.com";

export default function sitemap() {
  const routes = [
    "",
    "/contacto",
    "/proyectos",
    "/films",
    "/about",
    "/servicios",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : route === "/servicios" ? 0.9 : 0.8,
  }));
}

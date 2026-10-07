import { absoluteUrl } from "@/lib/site";

const routes = [
  { path: "/", priority: 1 },
  { path: "/servicios", priority: 0.9 },
  { path: "/contacto", priority: 0.8 },
  { path: "/proyectos", priority: 0.8 },
  { path: "/films", priority: 0.8 },
  { path: "/about", priority: 0.7 },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}

import { absoluteUrl } from "@/lib/site";

// Todo el mundo (Google, Bing y también los buscadores con IA como ChatGPT,
// Perplexity o Claude) puede leer la web, salvo la página de gracias y la API.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/gracias", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

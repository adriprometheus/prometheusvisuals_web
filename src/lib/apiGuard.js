// lib/apiGuard.js
//
// Protecciones comunes de /api/contact y /api/booking:
//  - Solo se aceptan peticiones JSON hechas desde la propia web.
//  - Tamaño máximo del cuerpo, para que nadie pueda mandar megas de texto.
//  - Límite de peticiones por IP (anti-spam y para no gastar la cuota de
//    Google Calendar / Resend). El contador vive en memoria de cada instancia
//    del servidor: no es perfecto en Vercel (hay varias), pero frena a la
//    inmensa mayoría de bots sin añadir otro servicio.

import { NextResponse } from "next/server";

const MAX_BODY_LENGTH = 10_000;
const buckets = new Map();

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Devuelve una respuesta 429 si esta IP ha superado `limit` peticiones en
 * los últimos `windowMs` milisegundos para la clave dada; si no, null.
 */
export function rateLimit(request, key, { limit, windowMs }) {
  const now = Date.now();
  const id = `${key}:${clientIp(request)}`;
  const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(id, hits);

  // Limpieza ocasional para que el mapa no crezca sin fin.
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) {
      if (now - v[v.length - 1] > windowMs) buckets.delete(k);
    }
  }

  if (hits.length > limit) {
    return NextResponse.json(
      { error: "Demasiadas peticiones. Espera un momento y vuelve a intentarlo." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) },
      },
    );
  }
  return null;
}

/**
 * Lee el cuerpo JSON de un POST comprobando origen, tipo y tamaño.
 * Devuelve { data } o { error: NextResponse }.
 */
export async function readJsonBody(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (origin) {
    let originHost = null;
    try {
      originHost = new URL(origin).host;
    } catch {}
    if (originHost !== host) {
      return { error: NextResponse.json({ error: "Origen no permitido." }, { status: 403 }) };
    }
  }

  // Exigir JSON impide que otra web envíe el formulario con un <form> oculto.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { error: NextResponse.json({ error: "Formato no admitido." }, { status: 415 }) };
  }

  const text = await request.text();
  if (text.length > MAX_BODY_LENGTH) {
    return { error: NextResponse.json({ error: "Mensaje demasiado largo." }, { status: 413 }) };
  }

  try {
    return { data: JSON.parse(text) };
  } catch {
    return { error: NextResponse.json({ error: "JSON inválido." }, { status: 400 }) };
  }
}

import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contactSchema";
import { sendContactNotification } from "@/lib/email";
import { rateLimit, readJsonBody } from "@/lib/apiGuard";

export async function POST(request) {
  const limited = rateLimit(request, "contact", { limit: 5, windowMs: 10 * 60_000 });
  if (limited) return limited;

  const { data: payload, error } = await readJsonBody(request);
  if (error) return error;

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot relleno = bot. Fingimos éxito y no enviamos nada.
  if (parsed.data.nickname) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactNotification(parsed.data);
  } catch (err) {
    console.error("[api/contact] Error enviando el email:", err);
    return NextResponse.json(
      { error: "No se ha podido enviar el formulario. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

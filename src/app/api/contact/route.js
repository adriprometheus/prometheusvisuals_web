import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contactSchema";
import { sendContactNotification } from "@/lib/email";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
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

  // TODO: además de enviar el email, aquí es un buen sitio para persistir
  // el lead en base de datos (Postgres/Prisma, Airtable, etc.).

  return NextResponse.json({ ok: true });
}

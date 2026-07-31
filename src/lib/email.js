import { Resend } from "resend";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendContactNotification(data) {
  const resend = getResendClient();
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!resend || !to) {
    console.warn(
      "[email] RESEND_API_KEY o CONTACT_TO_EMAIL no configurados. Email no enviado.",
      data,
    );
    return { skipped: true };
  }

  return resend.emails.send({
    from,
    to,
    replyTo: data.contactoTipo === "correo" ? data.correo : undefined,
    subject: `Nuevo contacto: ${data.nombreCompleto} — ${data.asunto}`,
    html: `
      <h2>Nuevo formulario de contacto simplificado</h2>
      <p><strong>Nombre completo:</strong> ${escapeHtml(data.nombreCompleto)}</p>
      <p><strong>Preferencia de contacto:</strong> ${escapeHtml(data.contactoTipo)}</p>
      
      ${
        data.contactoTipo === "correo"
          ? `<p><strong>Email:</strong> ${escapeHtml(data.correo)}</p>`
          : `<p><strong>Teléfono:</strong> ${escapeHtml(data.prefijo)} ${escapeHtml(data.telf)}</p>`
      }
      
      <p><strong>Empresa:</strong> ${escapeHtml(data.empresa)}</p>
      <p><strong>Web:</strong> ${data.web ? escapeHtml(data.web) : "No especificada"}</p>
      <p><strong>Asunto:</strong> ${escapeHtml(data.asunto)}</p>
      <p><strong>¿Cómo nos conoció?:</strong> ${escapeHtml(data.comoConociste)}</p>
      <p><strong>Mensaje:</strong><br/>${data.mensaje ? escapeHtml(data.mensaje).replace(/\n/g, "<br/>") : "Sin mensaje adicional"}</p>
    `,
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

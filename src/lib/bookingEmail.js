// lib/bookingEmail.js
//
// Reutiliza el mismo proveedor (Resend) que ya usa /api/contact.
// Separado en su propio archivo (no metido en route.js) para poder
// testear/editar el contenido del email sin tocar la lógica de reservas.

import { Resend } from "resend";
import { DateTime } from "luxon";
import { TIMEZONE } from "./schedule";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.BOOKING_FROM_EMAIL || "prometheus.visuals@gmail.com";
const COMPANY_EMAIL = process.env.COMPANY_EMAIL;
const COMPANY_NAME = process.env.COMPANY_NAME || "Nuestro equipo";

const BRAND_COLOR = "#ffffff"; // Texto / Detalles principales
const BG_DARK = "#171717"; // Fondo principal (estilo modal/card cozy)
const CARD_BG = "#262626"; // Fondo del contenedor/tabla
const TEXT_MUTED = "#a3a3a3"; // Texto secundario
const ACCENT_COLOR = "#ffffff"; // Botón principal
const ACCENT_TEXT = "#000000"; // Texto del botón

// Sustituye con la URL pública de tu logo
const LOGO_URL =
  process.env.COMPANY_LOGO_URL ||
  "https://prometheusvisuals.com/logos/Prometheus-logo.png";

function formatWhen(dateStr, timeStr) {
  return DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: TIMEZONE })
    .setLocale("es")
    .toFormat("cccc d 'de' LLLL 'a las' HH:mm '(hora de España)'");
}

function buildGoogleCalendarUrl({ title, description, dateStr, timeStr }) {
  // Convertimos la fecha y hora a formato ISO sin guiones/puntos para Google (YYYYMMDDTHHmmss)
  // Duración: 15 minutos
  const startdt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: TIMEZONE });
  const enddt = startdt.plus({ minutes: 60 });

  const fmt = (dt) => dt.toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${fmt(startdt)}/${fmt(enddt)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function sendClientConfirmation({
  to,
  name,
  dateStr,
  timeStr,
  meetLink,
}) {
  const when = formatWhen(dateStr, timeStr);

  const googleCalendarUrl = buildGoogleCalendarUrl({
    title: `Reunión de consultoría con ${COMPANY_NAME}`,
    description: `Enlace de la reunión: ${meetLink}`,
    dateStr,
    timeStr,
  });

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Reserva confirmada — ${when}`,
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 32px 16px; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <div style="max-width: 520px; margin: 0 auto; background-color: ${BG_DARK}; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 36px 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <div style="margin-bottom: 28px; text-align: left;">
            <img src="${LOGO_URL}" alt="${escapeHtml(COMPANY_NAME)}" style="height: 36px; width: auto; display: block;" />
          </div>

          <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0; color: #ffffff; letter-spacing: -0.5px;">
            ¡Reserva confirmada, ${escapeHtml(name)}!
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: ${TEXT_MUTED}; margin: 0 0 24px 0;">
            Hemos agendado tu espacio de consultoría. Nos conectaremos para evaluar tu caso directamente.
          </p>

          <div style="background-color: ${CARD_BG}; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: ${TEXT_MUTED}; font-size: 13px;">Cuándo</td>
                <td style="padding: 6px 0; font-weight: 600; color: #ffffff; text-align: right;">${when}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: ${TEXT_MUTED}; font-size: 13px;">Duración</td>
                <td style="padding: 6px 0; font-weight: 600; color: #ffffff; text-align: right;">60 minutos</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: ${TEXT_MUTED}; font-size: 13px;">Acceso Meet</td>
                <td style="padding: 6px 0; text-align: right;">
                  <a href="${meetLink}" target="_blank" style="color: #ffffff; font-weight: 600; text-decoration: underline;">Unirse a la reunión</a>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 32px; text-align: center;">
            <a href="${meetLink}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: ${ACCENT_COLOR}; color: ${ACCENT_TEXT}; padding: 14px 20px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
              Unirse a la reunión en Google Meet
            </a>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
            <p style="font-size: 13px; line-height: 1.6; color: ${TEXT_MUTED}; margin: 0 0 16px 0;">
              Hemos enviado la invitación directamente a tu agenda. Por favor, confirma tu asistencia marcando <strong style="color: #ffffff;">"Sí"</strong> en la notificación de tu calendario o en la cabecera de este correo.
            </p>

            <p style="font-size: 13px; line-height: 1.6; color: ${TEXT_MUTED}; margin: 0;">
              Si necesitas reprogramar o hacer alguna consulta previa, simplemente responde directamente a este correo.<br><br>
              <strong style="color: #ffffff;">${escapeHtml(COMPANY_NAME)}</strong>
            </p>
          </div>

        </div>
      </body>
    </html>
  `,
  });
}

export async function sendCompanyNotification({
  name,
  email,
  reason,
  dateStr,
  timeStr,
}) {
  if (!COMPANY_EMAIL) return null; // no bloquear la reserva si no está configurado
  const when = formatWhen(dateStr, timeStr);

  return resend.emails.send({
    from: FROM_EMAIL,
    to: COMPANY_EMAIL,
    subject: `Nueva reserva — ${when}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; color: #111;">
        <h3>Nueva reunión reservada</h3>
        <p><strong>Cuándo:</strong> ${when}</p>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Motivo:</strong> ${escapeHtml(reason?.trim() || "No especificado")}</p>
        <p style="color:#666; font-size: 13px;">El evento ya se ha añadido automáticamente a Google Calendar con el enlace de Meet.</p>
      </div>
    `,
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

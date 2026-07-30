// lib/googleCalendar.js
//
// Usa Google Calendar como única fuente de verdad tanto para:
//  1) Saber qué huecos están libres (freebusy) — incluyendo cualquier
//     evento que el propio cliente cree en su calendario para bloquear
//     un día (vacaciones, etc.) — así se autogestiona sin necesidad de
//     un panel de administración a medida.
//  2) Crear la reunión + enlace de Google Meet cuando alguien reserva.
//
// Requiere credenciales OAuth2 con un refresh_token de una cuenta que
// tenga acceso al calendario (ver SETUP.md para cómo generarlo). No se
// usa una cuenta de servicio "pelada" porque Google Meet solo se puede
// crear vía API para: (a) cuentas de Workspace con delegación de dominio,
// o (b) un usuario real autenticado por OAuth. Para un Gmail normal, la
// opción (b) es la única viable.

import { google } from "googleapis";
import { DateTime } from "luxon";
import { TIMEZONE, MEETING_DURATION_MINUTES } from "./schedule";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

function getOAuthClient() {
  const required = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(
      `Faltan variables de entorno de Google: ${missing.join(", ")}`,
    );
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

function getCalendarClient() {
  return google.calendar({ version: "v3", auth: getOAuthClient() });
}

/**
 * Convierte una fecha ('YYYY-MM-DD') y hora ('HH:mm') de negocio en un
 * rango de inicio/fin usando la zona horaria correcta, sin importar en
 * qué zona horaria esté corriendo el servidor.
 */
export function slotRange(dateStr, timeStr) {
  const start = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: TIMEZONE });
  const end = start.plus({ minutes: MEETING_DURATION_MINUTES });
  return { start, end };
}

/**
 * Devuelve los intervalos ocupados (busy) de todo el día para el
 * calendario configurado. Incluye tanto reuniones ya reservadas como
 * cualquier evento manual (bloqueo de vacaciones, etc.).
 */
export async function getBusyIntervals(dateStr) {
  const calendar = getCalendarClient();
  const dayStart = DateTime.fromISO(dateStr, { zone: TIMEZONE }).startOf("day");
  const dayEnd = dayStart.endOf("day");

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISO(),
      timeMax: dayEnd.toISO(),
      items: [{ id: CALENDAR_ID }],
    },
  });

  return res.data.calendars?.[CALENDAR_ID]?.busy || [];
}

export function isRangeBusy(busyIntervals, start, end) {
  return busyIntervals.some((b) => {
    const busyStart = DateTime.fromISO(b.start);
    const busyEnd = DateTime.fromISO(b.end);
    return start < busyEnd && end > busyStart;
  });
}

/**
 * Crea el evento en Google Calendar con videollamada de Google Meet y
 * devuelve el enlace generado.
 */
export async function createBookingEvent({
  dateStr,
  timeStr,
  name,
  email,
  reason,
}) {
  const calendar = getCalendarClient();
  const { start, end } = slotRange(dateStr, timeStr);

  const event = {
    summary: `Reunión con ${name}`,
    description: `Motivo: ${reason?.trim() || "No especificado"}\nContacto: ${email}`,
    start: { dateTime: start.toISO(), timeZone: TIMEZONE },
    end: { dateTime: end.toISO(), timeZone: TIMEZONE },
    attendees: [{ email }],
    conferenceData: {
      createRequest: {
        requestId: `booking-${dateStr}-${timeStr.replace(":", "")}-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
    conferenceDataVersion: 1,
    // Enviamos nosotros mismos los correos con nuestro propio diseño en
    // vez de dejar que lo haga Calendar con su plantilla genérica.
    sendUpdates: "none",
  });

  const meetLink =
    res.data.hangoutLink ||
    res.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video",
    )?.uri;

  return { eventId: res.data.id, meetLink, htmlLink: res.data.htmlLink };
}

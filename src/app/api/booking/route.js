import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import {
  getAllowedSlotsForDate,
  isDateFormatValid,
  isTimeFormatValid,
  TIMEZONE,
} from "@/lib/schedule";
import {
  getBusyIntervals,
  isRangeBusy,
  slotRange,
  createBookingEvent,
} from "@/lib/googleCalendar";
import {
  sendClientConfirmation,
  sendCompanyNotification,
} from "@/lib/bookingEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !isDateFormatValid(date)) {
    return NextResponse.json(
      { error: "Falta o es inválido el parámetro 'date'." },
      { status: 400 },
    );
  }

  // No permitir fechas ya pasadas, calculado en la zona horaria de negocio
  // (no en la del servidor) para que sea consistente pase lo que pase con
  // dónde esté desplegado.
  const todayStr = DateTime.now().setZone(TIMEZONE).toISODate();
  const allowedTimes = getAllowedSlotsForDate(date);

  if (date < todayStr || allowedTimes.length === 0) {
    return NextResponse.json({ date, slots: [] });
  }

  try {
    const busy = await getBusyIntervals(date);
    const isToday = date === todayStr;
    const now = DateTime.now().setZone(TIMEZONE);

    const slots = allowedTimes.map((time) => {
      const { start, end } = slotRange(date, time);
      const alreadyPast = isToday && start < now;
      return {
        time,
        available: !alreadyPast && !isRangeBusy(busy, start, end),
      };
    });

    return NextResponse.json({ date, slots });
  } catch (err) {
    console.error("Error consultando disponibilidad:", err);
    return NextResponse.json(
      { error: "No se ha podido consultar la disponibilidad." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { date, time, name, email, reason, website } = body || {};

  // Honeypot anti-spam: campo invisible que un humano nunca rellena.
  // Si viene relleno, fingimos éxito y no hacemos nada más.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!date || !isDateFormatValid(date) || !time || !isTimeFormatValid(time)) {
    return NextResponse.json(
      { error: "Fecha u hora inválidas." },
      { status: 400 },
    );
  }
  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "El nombre es obligatorio." },
      { status: 400 },
    );
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Introduce un correo válido." },
      { status: 400 },
    );
  }

  // Revalidación server-side del horario permitido. El frontend ya filtra
  // esto, pero nunca hay que confiar en lo que llega del cliente: cualquiera
  // puede llamar a este endpoint directamente con curl.
  const allowedTimes = getAllowedSlotsForDate(date);
  if (!allowedTimes.includes(time)) {
    return NextResponse.json(
      { error: "Ese horario no está disponible." },
      { status: 409 },
    );
  }

  const todayStr = DateTime.now().setZone(TIMEZONE).toISODate();
  if (date < todayStr) {
    return NextResponse.json(
      { error: "No se puede reservar una fecha pasada." },
      { status: 409 },
    );
  }

  try {
    const { start, end } = slotRange(date, time);

    // Comprobación de disponibilidad real justo antes de crear el evento
    // (reduce, aunque no elimina del todo, la ventana de doble reserva).
    const busy = await getBusyIntervals(date);
    if (isRangeBusy(busy, start, end)) {
      return NextResponse.json(
        { error: "Ese hueco ya no está disponible. Elige otro." },
        { status: 409 },
      );
    }

    const { meetLink } = await createBookingEvent({
      dateStr: date,
      timeStr: time,
      name: name.trim(),
      email: email.trim(),
      reason,
    });

    // No dejamos que un fallo de email tumbe la reserva: el evento ya
    // existe en Calendar, que es lo importante. Se registran errores para
    // poder revisarlos, pero se responde éxito al usuario.
    const results = await Promise.allSettled([
      sendClientConfirmation({
        to: email.trim(),
        name: name.trim(),
        dateStr: date,
        timeStr: time,
        meetLink,
      }),
      sendCompanyNotification({
        name: name.trim(),
        email: email.trim(),
        reason,
        dateStr: date,
        timeStr: time,
      }),
    ]);
    results.forEach((r) => {
      if (r.status === "rejected")
        console.error("Error enviando email:", r.reason);
    });

    return NextResponse.json({ ok: true, date, time, meetLink });
  } catch (err) {
    console.error("Error creando la reserva:", err);
    return NextResponse.json(
      { error: "No se ha podido confirmar la reserva. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}

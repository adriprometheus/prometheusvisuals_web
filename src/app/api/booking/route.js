import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { getAllowedSlotsForDate, MAX_DAYS_AHEAD, TIMEZONE } from "@/lib/schedule";
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
import { bookingDate, bookingSchema } from "@/lib/bookingSchema";
import { rateLimit, readJsonBody } from "@/lib/apiGuard";

// Fechas reservables: desde hoy hasta MAX_DAYS_AHEAD días vista, calculado en
// la zona horaria de negocio (no en la del servidor) para que sea consistente
// pase lo que pase con dónde esté desplegado.
function isDateInRange(date) {
  const today = DateTime.now().setZone(TIMEZONE).startOf("day");
  const day = DateTime.fromISO(date, { zone: TIMEZONE });
  return day >= today && day <= today.plus({ days: MAX_DAYS_AHEAD });
}

export async function GET(request) {
  const limited = rateLimit(request, "booking-get", { limit: 40, windowMs: 60_000 });
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!bookingDate.safeParse(date).success) {
    return NextResponse.json(
      { error: "Falta o es inválido el parámetro 'date'." },
      { status: 400 },
    );
  }

  const todayStr = DateTime.now().setZone(TIMEZONE).toISODate();
  const allowedTimes = getAllowedSlotsForDate(date);

  if (!isDateInRange(date) || allowedTimes.length === 0) {
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
  const limited = rateLimit(request, "booking-post", { limit: 5, windowMs: 10 * 60_000 });
  if (limited) return limited;

  const { data: body, error } = await readJsonBody(request);
  if (error) return error;

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return NextResponse.json(
      { error: first || "Datos inválidos." },
      { status: 400 },
    );
  }
  const { date, time, name, email, reason, website } = parsed.data;

  // Honeypot anti-spam: campo invisible que un humano nunca rellena.
  // Si viene relleno, fingimos éxito y no hacemos nada más.
  if (website) {
    return NextResponse.json({ ok: true });
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

  if (!isDateInRange(date)) {
    return NextResponse.json(
      { error: "Esa fecha no se puede reservar." },
      { status: 409 },
    );
  }

  try {
    const { start, end } = slotRange(date, time);
    if (start < DateTime.now().setZone(TIMEZONE)) {
      return NextResponse.json(
        { error: "Esa hora ya ha pasado. Elige otra." },
        { status: 409 },
      );
    }

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
      name,
      email,
      reason,
    });

    // No dejamos que un fallo de email tumbe la reserva: el evento ya
    // existe en Calendar, que es lo importante. Se registran errores para
    // poder revisarlos, pero se responde éxito al usuario.
    const results = await Promise.allSettled([
      sendClientConfirmation({
        to: email,
        name,
        dateStr: date,
        timeStr: time,
        meetLink,
      }),
      sendCompanyNotification({
        name,
        email: email,
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

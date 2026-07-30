// lib/schedule.js
//
// Única fuente de verdad sobre qué días/horas se pueden reservar.
// Tanto el frontend (para pintar el calendario) como el backend (para
// validar de verdad) importan de aquí, así nunca se pueden desincronizar.

export const MEETING_DURATION_MINUTES = 60;

// Zona horaria de negocio. Se fija explícitamente para que el servidor
// (que puede correr en UTC, p.ej. en Vercel) construya siempre las horas
// correctas independientemente de dónde esté desplegado.
export const TIMEZONE = "Europe/Madrid";

// Claves = day of week según getUTCDay(): 0 domingo ... 3 miércoles, 5 viernes.
export const WEEKLY_SCHEDULE = {
  3: ["10:00", "11:00", "12:00", "13:00"], // miércoles: 10, 11, 12, 13
  5: ["09:00", "10:00", "11:00", "12:00", "13:00"], // viernes: 9, 10, 11, 12, 13
};

/**
 * Devuelve las horas potencialmente reservables para una fecha (antes de
 * comprobar disponibilidad real contra Google Calendar).
 * @param {string} dateStr formato 'YYYY-MM-DD'
 */
export function getAllowedSlotsForDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return [];
  // Se usa Date.UTC con componentes explícitos (no parseo de string) para
  // evitar el clásico bug de "new Date('YYYY-MM-DD')" desplazando el día
  // según el huso horario del entorno de ejecución.
  const dayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return WEEKLY_SCHEDULE[dayOfWeek] || [];
}

export function isDateFormatValid(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

export function isTimeFormatValid(timeStr) {
  return /^\d{2}:\d{2}$/.test(timeStr);
}

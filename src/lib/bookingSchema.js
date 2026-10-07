import { z } from "zod";
import { DateTime } from "luxon";
import { TIMEZONE } from "./schedule";

// Fecha 'YYYY-MM-DD' que además exista de verdad (no 2026-02-31).
export const bookingDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
  .refine((d) => DateTime.fromISO(d, { zone: TIMEZONE }).isValid, "Fecha inválida");

export const bookingSchema = z.object({
  date: bookingDate,
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(120),
  email: z.string().trim().max(254).email("Introduce un correo válido."),
  reason: z.string().trim().max(1000, "El motivo es demasiado largo.").optional(),
  // Honeypot anti-spam
  website: z.string().max(200).optional(),
});

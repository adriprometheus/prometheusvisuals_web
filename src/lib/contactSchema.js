import { z } from "zod";

export const contactSchema = z.discriminatedUnion("contactoTipo", [
  // CASO 1: El usuario prefiere contacto por Correo electrónico
  z.object({
    contactoTipo: z.literal("correo"),
    nombreCompleto: z
      .string()
      .trim()
      .min(1, "El nombre completo es obligatorio"),
    correo: z.string().trim().email("Introduce un correo electrónico válido"),
    empresa: z.string().trim().min(1, "La empresa es obligatoria"),
    web: z.string().trim().optional(),
    asunto: z.string().trim().min(1, "El asunto es obligatorio"),
    comoConociste: z
      .string()
      .trim()
      .min(1, "Selecciona una opción"),
    mensaje: z.string().trim().optional(),
    politica: z
      .union([z.literal("on"), z.literal(true), z.literal("true")])
      .refine((v) => !!v, "Debes aceptar la política de privacidad"),
  }),

  // CASO 2: El usuario prefiere contacto por Teléfono / WhatsApp
  z.object({
    contactoTipo: z.literal("telf"),
    nombreCompleto: z
      .string()
      .trim()
      .min(1, "El nombre completo es obligatorio"),
    prefijo: z.string().trim().min(1, "Selecciona un prefijo"),
    telf: z
      .string()
      .trim()
      .regex(/^[0-9]{9}$/, "El teléfono debe tener exactamente 9 dígitos"),
    empresa: z.string().trim().min(1, "La empresa es obligatoria"),
    web: z.string().trim().optional(),
    asunto: z.string().trim().min(1, "El asunto es obligatorio"),
    comoConociste: z
      .string()
      .trim()
      .min(1, "Selecciona una opción"),
    mensaje: z.string().trim().optional(),
    politica: z
      .union([z.literal("on"), z.literal(true), z.literal("true")])
      .refine((v) => !!v, "Debes aceptar la política de privacidad"),
  }),
]);

import { z } from "zod";

// Texto obligatorio con longitud máxima (evita mensajes kilométricos de bots).
const required = (msg, max = 200) =>
  z.string().trim().min(1, msg).max(max, "Texto demasiado largo");

const politica = z
  .union([z.literal("on"), z.literal(true), z.literal("true")])
  .refine((v) => !!v, "Debes aceptar la política de privacidad");

// Campos comunes a las dos formas de contacto.
const base = z.object({
  nombreCompleto: required("El nombre completo es obligatorio", 120),
  empresa: required("La empresa es obligatoria", 120),
  web: z.string().trim().max(200, "Texto demasiado largo").optional(),
  asunto: required("El asunto es obligatorio", 200),
  comoConociste: required("Selecciona una opción", 100),
  mensaje: z.string().trim().max(3000, "Mensaje demasiado largo").optional(),
  politica,
  // Honeypot anti-spam: campo invisible que una persona nunca rellena.
  nickname: z.string().max(200).optional(),
});

export const contactSchema = z.discriminatedUnion("contactoTipo", [
  // CASO 1: El usuario prefiere contacto por Correo electrónico
  base.extend({
    contactoTipo: z.literal("correo"),
    correo: z
      .string()
      .trim()
      .max(254)
      .email("Introduce un correo electrónico válido"),
  }),

  // CASO 2: El usuario prefiere contacto por Teléfono / WhatsApp
  base.extend({
    contactoTipo: z.literal("telf"),
    prefijo: z
      .string()
      .trim()
      .regex(/^\+\d{1,4}$/, "Selecciona un prefijo"),
    telf: z
      .string()
      .trim()
      .regex(/^[0-9]{9}$/, "El teléfono debe tener exactamente 9 dígitos"),
  }),
]);

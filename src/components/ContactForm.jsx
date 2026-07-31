"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { countryCodes } from "@/data/countryCodes";

const initialForm = {
  nombreCompleto: "",
  contactoTipo: "correo", // 'correo' o 'telf'
  correo: "",
  prefijo: "+34",
  telf: "",
  empresa: "",
  web: "",
  asunto: "",
  comoConociste: "",
  mensaje: "",
  politica: false,
};

function Field({ label, error, children }) {
  return (
    <div className="form-input-group">
      {children}
      <label>{label}</label>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const dialogRef = useRef(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const markTouched = (key) => setTouched((t) => ({ ...t, [key]: true }));

  // Validación ágil del formulario simplificado
  const isFormValid = () => {
    if (!form.nombreCompleto.trim()) return false;
    if (!form.empresa.trim()) return false;
    if (!form.asunto.trim()) return false;
    if (!form.comoConociste) return false;
    if (!form.politica) return false;

    if (form.contactoTipo === "correo") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo);
    } else {
      return /^[0-9]{9}$/.test(form.telf);
    }
  };

  function handleWebBlur() {
    const value = form.web.trim();
    if (value && !/^https?:\/\//i.test(value) && value.includes(".")) {
      update("web", `https://${value}`);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) return;

    setSubmitting(true);
    setServerError(null);

    // Preparar payload limpio según la opción elegida
    const payload = {
      nombreCompleto: form.nombreCompleto,
      contactoTipo: form.contactoTipo,
      empresa: form.empresa,
      web: form.web,
      asunto: form.asunto,
      comoConociste: form.comoConociste,
      mensaje: form.mensaje,
      politica: form.politica,
      ...(form.contactoTipo === "correo"
        ? { correo: form.correo }
        : { prefijo: form.prefijo, telf: form.telf }),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se ha podido enviar el formulario.");
      }

      router.push("/gracias");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-xl flex-col gap-6"
      >
        <h2 className="text-h3 font-semibold mb-2">
          Cuéntanos en qué estás pensando
        </h2>

        {/* 1. Nombre Completo */}
        <Field
          label="Nombre completo"
          error={
            touched.nombreCompleto && !form.nombreCompleto.trim()
              ? "Obligatorio"
              : null
          }
        >
          <input
            value={form.nombreCompleto}
            onChange={(e) => update("nombreCompleto", e.target.value)}
            onBlur={() => markTouched("nombreCompleto")}
            placeholder=" "
            required
          />
        </Field>

        {/* 2. Selector de Método de Contacto (Tabs) */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-auxwhite/80">
            ¿Cómo prefieres que te contactemos?
          </span>
          <div className="flex gap-2 bg-neutral-900/60 p-1 rounded-full border border-white/5 w-fit">
            <button
              type="button"
              onClick={() => update("contactoTipo", "correo")}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                form.contactoTipo === "correo"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Correo electrónico
            </button>
            <button
              type="button"
              onClick={() => update("contactoTipo", "telf")}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                form.contactoTipo === "telf"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Teléfono / WhatsApp
            </button>
          </div>
        </div>

        {/* 3. Campo Dinámico según Tab */}
        {form.contactoTipo === "correo" ? (
          <Field
            label="Correo Electrónico"
            error={
              touched.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
                ? "Introduce un correo válido"
                : null
            }
          >
            <input
              type="email"
              value={form.correo}
              onChange={(e) => update("correo", e.target.value)}
              onBlur={() => markTouched("correo")}
              placeholder=" "
              required={form.contactoTipo === "correo"}
            />
          </Field>
        ) : (
          <div className="flex items-start gap-2">
            <select
              value={form.prefijo}
              onChange={(e) => update("prefijo", e.target.value)}
              aria-label="Prefijo telefónico"
              className="w-28 shrink-0 rounded-lg border border-auxwhite/50 bg-transparent px-3 py-3.75 text-secnd outline-none focus:border-secnd cursor-pointer"
              required={form.contactoTipo === "telf"}
            >
              {countryCodes.map((c) => (
                <option
                  key={`${c.code}-${c.name}`}
                  value={c.code}
                  className="text-main"
                >
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <Field
              label="Teléfono"
              error={
                touched.telf && !/^[0-9]{9}$/.test(form.telf)
                  ? "Introduce exactamente 9 dígitos"
                  : null
              }
            >
              <input
                type="tel"
                value={form.telf}
                onChange={(e) =>
                  update("telf", e.target.value.replace(/[^0-9]/g, ""))
                }
                onBlur={() => markTouched("telf")}
                maxLength={9}
                placeholder=" "
                required={form.contactoTipo === "telf"}
              />
            </Field>
          </div>
        )}

        {/* 4. Empresa y Web */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Empresa"
            error={
              touched.empresa && !form.empresa.trim() ? "Obligatorio" : null
            }
          >
            <input
              value={form.empresa}
              onChange={(e) => update("empresa", e.target.value)}
              onBlur={() => markTouched("empresa")}
              placeholder=" "
              required
            />
          </Field>

          <Field label="Sitio web (Opcional)">
            <input
              type="url"
              value={form.web}
              onChange={(e) => update("web", e.target.value)}
              onBlur={handleWebBlur}
              placeholder=" "
            />
          </Field>
        </div>

        {/* 5. Asunto */}
        <Field
          label="Asunto"
          error={touched.asunto && !form.asunto.trim() ? "Obligatorio" : null}
        >
          <input
            value={form.asunto}
            onChange={(e) => update("asunto", e.target.value)}
            onBlur={() => markTouched("asunto")}
            placeholder=" "
            required
          />
        </Field>

        {/* 5b. Cómo nos conociste */}
<div className="flex flex-col gap-2">
  <select
    id="comoConociste"
    value={form.comoConociste}
    onChange={(e) => update("comoConociste", e.target.value)}
    onBlur={() => markTouched("comoConociste")}
    required
    className={`w-full rounded-lg border border-auxwhite/50 bg-transparent px-3 py-3.75 outline-none focus:border-secnd cursor-pointer ${
      form.comoConociste ? "text-secnd" : "text-neutral-400"
    }`}
  >
    <option value="" disabled className="text-neutral-400">
      ¿Qué te ha traído hasta aquí?
    </option>
    <option value="Os encontré en Google" className="text-main">Os encontré en Google</option>
    <option value="Alguien me habló muy bien de vosotros" className="text-main">Alguien me habló muy bien de vosotros</option>
    <option value="Os vi en redes sociales" className="text-main">Os vi en redes sociales</option>
    <option value="Hice click en uno de vuestros anuncios" className="text-main">Hice click en uno de vuestros anuncios</option>
    <option value="Nos vimos en un evento" className="text-main">Nos vimos en un evento</option>
    <option value="Otro" className="text-main">Otro</option>
  </select>
  {touched.comoConociste && !form.comoConociste && (
    <p className="text-xs text-red-400">Obligatorio</p>
  )}
</div>

        {/* 6. Textarea (Opcional) */}
        <Field label="¿Qué te gustaría hacer? (Opcional)">
          <textarea
            rows={4}
            value={form.mensaje}
            onChange={(e) => update("mensaje", e.target.value)}
            placeholder=" "
          />
        </Field>

        {/* 7. Privacidad */}
        <div className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            id="privacy-policy-chbx"
            checked={form.politica}
            onChange={(e) => update("politica", e.target.checked)}
            className="mt-1 cursor-pointer"
            required
          />
          <label htmlFor="privacy-policy-chbx" className="cursor-pointer">
            He leído y acepto la{" "}
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              className="cursor-pointer underline"
            >
              política de privacidad
            </button>
          </label>
        </div>

        {/* Botón de envío único */}
        <button
          type="submit"
          disabled={!isFormValid() || submitting}
          className="cursor-pointer rounded-full bg-secnd py-3 font-medium text-main transition-colors disabled:cursor-not-allowed disabled:opacity-30"
        >
          {submitting ? "ENVIANDO…" : "¡ESTO VA A EMPEZAR A LO GRANDE!"}
        </button>

        {serverError && <p className="text-sm text-red-400">{serverError}</p>}
      </form>

      {/* El componente <dialog> de la política se queda exactamente igual */}
      <dialog
        ref={dialogRef}
        className="privacy-modal max-w-lg rounded-2xl bg-projects p-6 text-secnd backdrop:bg-black/70"
      >
        {/* ... (Contenido del modal intacto) ... */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="cursor-pointer text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <h2 className="text-h3 font-semibold">Política de Privacidad</h2>
        <p className="mt-1 text-sm text-auxwhite">Prometheus Visuals © 2026</p>
        <div className="mt-4 max-h-[50vh] space-y-4 overflow-y-auto pr-2 text-sm leading-relaxed">
          <p>
            Usted tiene derecho a acceder, rectificar y suprimir sus datos en
            cualquier momento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="mt-6 w-full cursor-pointer rounded-full bg-secnd py-3 font-medium text-main"
        >
          Entendido
        </button>
      </dialog>
    </>
  );
}

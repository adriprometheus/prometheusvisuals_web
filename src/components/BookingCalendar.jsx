"use client";

import { useState, useMemo, useRef, useEffect } from "react";

function isDayDisabled(day, month, year) {
  const checkDate = new Date(year, month, day);
  const dayOfWeek = checkDate.getDay();
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (checkDate < todayMidnight) return true;
  // Solo se aceptan miércoles (3) y viernes (5). El resto de días de
  // semana también quedan deshabilitados aquí para que el frontend refleje
  // exactamente el mismo horario que valida el backend (lib/schedule.js).
  if (dayOfWeek !== 3 && dayOfWeek !== 5) return true;
  return false;
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function Field({ label, error, children }) {
  return (
    <div className="form-input-group">
      {children}
      <label>{label}</label>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const initialContact = { name: "", email: "", reason: "", website: "" };

export default function BookingCalendar() {
  const [date, setDate] = useState(new Date());

  // FIX: antes se guardaba solo el número de día (`selectedDay`), sin mes
  // ni año. Si el usuario abría el panel de horas para un día y luego
  // cambiaba de mes con las flechas, `selectedDay` seguía apuntando al
  // número antiguo pero se combinaba con el mes/año NUEVOS al confirmar,
  // permitiendo reservar una fecha que nunca se validó. Ahora se guarda el
  // objeto de fecha completo en el momento del clic.
  const [selectedDate, setSelectedDate] = useState(null); // { day, month, year }
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isBookingActive, setIsBookingActive] = useState(false);

  // Modal de contacto (nombre / email / motivo) antes de confirmar.
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contact, setContact] = useState(initialContact);
  const [touched, setTouched] = useState({});
  const [confirmedMeetLink, setConfirmedMeetLink] = useState(null);

  const containerRef = useRef(null);
  const hoursPanelRef = useRef(null);
  const contactDialogRef = useRef(null);

  const month = date.getMonth();
  const year = date.getFullYear();

  const monthLabel = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
    date,
  );

  const days = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const cells = [];
    for (let x = 0; x < startDay; x++) cells.push(null);
    for (let i = 1; i <= lastDay; i++) cells.push(i);
    return cells;
  }, [month, year]);

  const today = new Date();
  const prevDisabled =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month <= today.getMonth());

  // FIX: cambiar de mes mientras hay un día seleccionado dejaba el panel de
  // horas "vivo" con datos de un día que ya no corresponde a la vista
  // actual. Al cambiar de mes, se cierra el flujo de reserva por completo.
  function goToMonth(newDate) {
    setDate(newDate);
    setIsBookingActive(false);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setError(null);
  }

  useEffect(() => {
    if (!success || !containerRef.current) return;
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    const timeoutId = setTimeout(() => {
      const offset = 120;
      const elementPosition = containerRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [success]);

  async function handleDayClick(day) {
    const clickedDate = { day, month, year };
    setSelectedDate(clickedDate);
    setSelectedSlot(null);
    setSuccess(false);
    setError(null);
    setIsBookingActive(true);
    setLoadingSlots(true);

    setTimeout(() => {
      if (window.innerWidth < 1024 && hoursPanelRef.current) {
        const offset = 112;
        const elementPosition =
          hoursPanelRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 150);

    try {
      const res = await fetch(
        `/api/booking?date=${toDateStr(clickedDate.year, clickedDate.month, clickedDate.day)}`,
      );
      const data = await res.json();

      // Protección extra: si el usuario ya cambió de día otra vez mientras
      // la petición estaba en vuelo, no pisamos su selección actual con
      // una respuesta obsoleta.
      setSelectedDate((current) => {
        if (
          current &&
          current.day === clickedDate.day &&
          current.month === clickedDate.month &&
          current.year === clickedDate.year
        ) {
          setSlots(data.slots || []);
        }
        return current;
      });
    } catch {
      setError("No se han podido cargar las horas disponibles.");
    } finally {
      setLoadingSlots(false);
    }
  }

  function openContactModal() {
    if (!selectedSlot) return;
    setError(null);
    setIsContactModalOpen(true);
    contactDialogRef.current?.showModal();
  }

  function closeContactModal() {
    setIsContactModalOpen(false);
    contactDialogRef.current?.close();
  }

  function updateContact(key, value) {
    setContact((c) => ({ ...c, [key]: value }));
  }

  function markTouched(key) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function isContactValid() {
    if (!contact.name.trim()) return false;
    if (!contact.reason.trim()) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
  }

  async function confirmBooking(e) {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !isContactValid()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: toDateStr(
            selectedDate.year,
            selectedDate.month,
            selectedDate.day,
          ),
          time: selectedSlot,
          name: contact.name,
          email: contact.email,
          reason: contact.reason,
          website: contact.website, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "No se ha podido confirmar la reserva.");
      }

      setConfirmedMeetLink(data.meetLink || null);
      closeContactModal();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div ref={containerRef} className="w-full min-w-0 relative">
      {/* STACK: el flujo de reserva y la pantalla de éxito viven en la
          MISMA celda de grid (col-start-1 row-start-1), superpuestos.
          Así el contenedor mide siempre lo mismo (el máximo de los dos),
          y activar `success` no cambia la altura de la página ni un
          píxel -- nada que el "scroll-behavior: smooth" global pueda
          animar de forma rara, porque no hay ningún salto que corregir. */}
      <div className="grid w-full">
        {/* FLUJO: texto / calendario / horas */}
        <div
          className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-300
            ${success ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div
            className={`grid grid-cols-1 gap-y-6 lg:gap-x-0
              lg:transition-[grid-template-columns] lg:duration-500 lg:ease-out
              ${isBookingActive ? "lg:grid-cols-[0fr_7fr_5fr]" : "lg:grid-cols-[5fr_7fr_0fr]"}`}
          >
            {/* COLUMNA TEXTO. */}
            <div
              className={`min-w-0 lg:self-start lg:overflow-hidden flex flex-col justify-start transition-opacity duration-300
                ${
                  isBookingActive
                    ? "hidden lg:block lg:opacity-0 lg:pointer-events-none"
                    : "block opacity-100"
                }`}
            >
              <span className="text-xs text-center uppercase tracking-widest text-neutral-500 font-semibold mb-2 block">
                RESERVA DIRECTA
              </span>
              <h2 className="text-1xl text-center font-bold text-white tracking-tight leading-tight">
                RESERVA UNA REUNIÓN <br className="hidden sm:inline" /> DE 60
                MIN
              </h2>
              <p className="text-sm text-neutral-400 text-center mt-4 leading-relaxed max-w-sm">
                Elige la fecha y hora que mejor te vaya en nuestro calendario y hablamos sobre tu proyecto.
              </p>
            </div>

            {/* COLUMNA CALENDARIO. */}
            <div
              className={`min-w-0 lg:self-start lg:transition-[margin] lg:duration-500 lg:ease-out
                ${
                  isBookingActive
                    ? "lg:ml-0 lg:mr-8 xl:mr-12"
                    : "lg:ml-8 xl:ml-12 lg:mr-0"
                }`}
            >
              <div className="w-full rounded-3xl bg-neutral-900/40 border border-white/5 p-4 sm:p-8 lg:p-6 xl:p-8 flex flex-col justify-between transition-all duration-500">
                <div>
                  {/* Controles del mes */}
                  <div className="flex items-center justify-between px-1">
                    <button
                      onClick={() => goToMonth(new Date(year, month - 1, 1))}
                      disabled={prevDisabled}
                      className="px-4 py-2 text-xl disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-white/10 rounded-xl transition-colors"
                      aria-label="Mes anterior"
                    >
                      &lt;
                    </button>
                    <p className="capitalize font-medium text-white tracking-wide">
                      {monthLabel} {year}
                    </p>
                    <button
                      onClick={() => goToMonth(new Date(year, month + 1, 1))}
                      className="px-4 py-2 text-xl cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
                      aria-label="Mes siguiente"
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Días de la semana */}
                  <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                      (d) => (
                        <p key={d}>{d}</p>
                      ),
                    )}
                  </div>

                  {/* Grid de días */}
                  <div className="calendar-days-grid mt-4 gap-1 sm:gap-2">
                    {days.map((day, idx) => {
                      if (day === null) return <div key={idx} />;
                      const disabled = isDayDisabled(day, month, year);
                      const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                      const isSelected =
                        selectedDate &&
                        selectedDate.day === day &&
                        selectedDate.month === month &&
                        selectedDate.year === year;

                      return (
                        <div
                          key={idx}
                          onClick={() => !disabled && handleDayClick(day)}
                          className={`calendar-day 
                            ${isToday ? "today" : ""} 
                            ${disabled ? "day-disabled" : ""} 
                            ${isSelected && isBookingActive ? "bg-white text-black font-bold rounded-xl" : ""}`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA HORAS. */}
            {/* COLUMNA HORAS Y FORMULARIO */}
            <div
              ref={hoursPanelRef}
              className={`min-w-0 lg:self-start lg:overflow-hidden transition-opacity duration-300
                ${
                  isBookingActive
                    ? "block opacity-100"
                    : "hidden lg:block lg:opacity-0 lg:pointer-events-none"
                }`}
            >
              <div className="w-full h-full bg-neutral-900/30 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {selectedDate
                          ? `${selectedDate.day} de ${monthLabel}`
                          : ""}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Reunión de consultoría de 60 minutos
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToMonth(date)}
                      className="text-xs text-neutral-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-colors focus:outline-none"
                    >
                      Cancelar
                    </button>
                  </div>

                  {loadingSlots ? (
                    <div className="py-12 flex flex-col items-center gap-4">
                      <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                      <p className="text-xs text-neutral-500 tracking-wider uppercase">
                        Buscando huecos libres...
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`py-3.5 rounded-2xl text-sm font-medium transition-all border
                            ${!slot.available ? "opacity-15 border-transparent cursor-not-allowed" : "border-white/5 hover:border-white/20 hover:bg-white/2"}
                            ${selectedSlot === slot.time ? "bg-white text-black border-white font-semibold" : "text-neutral-300"}`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* FORMULARIO DE DATOS */}
                  {selectedSlot && (
                    <form
                      onSubmit={confirmBooking}
                      noValidate
                      className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 animate-fadeIn"
                    >
                      <Field
                        label="Nombre completo"
                        error={
                          touched.name && !contact.name.trim()
                            ? "Obligatorio"
                            : null
                        }
                      >
                        <input
                          value={contact.name}
                          onChange={(e) =>
                            updateContact("name", e.target.value)
                          }
                          onBlur={() => markTouched("name")}
                          placeholder=" "
                          required
                        />
                      </Field>

                      <Field
                        label="Correo electrónico"
                        error={
                          touched.email &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                            ? "Introduce un correo válido"
                            : null
                        }
                      >
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) =>
                            updateContact("email", e.target.value)
                          }
                          onBlur={() => markTouched("email")}
                          placeholder=" "
                          required
                        />
                      </Field>

                      <Field
                        label="Motivo de la reunión"
                        error={
                          touched.reason && !contact.reason.trim()
                            ? "El motivo es obligatorio"
                            : null
                        }
                      >
                        <textarea
                          rows={2}
                          value={contact.reason}
                          onChange={(e) =>
                            updateContact("reason", e.target.value)
                          }
                          onBlur={() => markTouched("reason")}
                          placeholder=" "
                          required
                        />
                      </Field>

                      {/* Honeypot anti-spam */}
                      <input
                        type="text"
                        name="website"
                        value={contact.website}
                        onChange={(e) =>
                          updateContact("website", e.target.value)
                        }
                        tabIndex={-1}
                        autoComplete="off"
                        className="absolute left-[-9999px] w-px h-px opacity-0"
                        aria-hidden="true"
                      />

                      {error && <p className="text-sm text-red-400">{error}</p>}

                      <button
                        type="submit"
                        disabled={!isContactValid() || submitting}
                        className="mt-2 w-full py-4 rounded-full bg-white text-black font-bold text-xs sm:text-sm tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        {submitting ? "CONFIRMANDO…" : "CONFIRMAR RESERVA"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANTALLA DE ÉXITO. */}
        <div
          className={`col-start-1 row-start-1 min-w-0 transition-opacity duration-300
            ${success ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="w-full h-full min-h-105 bg-neutral-900/10 backdrop-blur-xl border border-white/5 rounded-[40px] py-10 px-10 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg shadow-white/5">
              <span className="text-black text-3xl font-bold">✓</span>
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              ¡Reserva confirmada con éxito!
            </h3>
            <p className="text-neutral-400 mt-4 max-w-md text-base leading-relaxed">
              Hemos bloqueado tu espacio para conocernos. En unos minutos
              recibirás un email con los detalles de la reunión y el acceso
              directo. ¡Hablamos pronto!
            </p>
            {confirmedMeetLink && (
              <a
                href={confirmedMeetLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 text-sm underline text-white"
              >
                Ver enlace de la reunión
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

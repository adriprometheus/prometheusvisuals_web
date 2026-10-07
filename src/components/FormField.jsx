import { cloneElement, useId } from "react";

// Envuelve un input/textarea y le asocia su <label> con un id único.
// IMPORTANTE: el <label> debe seguir justo DESPUÉS del input, porque el CSS
// (globals.css: `input:focus + label`) depende de que sean hermanos contiguos.
export default function Field({ label, error, children }) {
  const id = useId();
  return (
    <div className="form-input-group">
      {cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      <label htmlFor={id}>{label}</label>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

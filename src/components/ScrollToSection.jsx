"use client";

// Botón que baja con scroll suave hasta una sección de la misma página
// (por ejemplo "precios" o "contacto") y actualiza el #hash de la URL.
export default function ScrollToSection({ targetId, children, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

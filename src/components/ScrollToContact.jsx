"use client";

export default function ScrollToContact({ children, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById("contacto");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Opcional: actualiza el hash en la URL sin bloquear futuros clics
      window.history.pushState(null, "", "#contacto");
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

"use client";

export default function ScrollToPricing({ children, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById("precios");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Opcional: actualiza el hash en la URL sin bloquear futuros clics
      window.history.pushState(null, "", "#precios");
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

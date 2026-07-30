"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/contacto", label: "CONTACTO" },
  { href: "/servicios", label: "SERVICIOS" },
  { href: "/proyectos", label: "FOTOGRAFÍA" },
  { href: "/films", label: "VÍDEOS" },
  { href: "/about", label: "CONOCE PROMETHEUS" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const visibleLinks = LINKS.filter((link) => link.href !== pathname);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, pathname]);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.documentElement.classList.toggle("mobile-menu-open", open);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 z-100 w-full px-4 pt-4 sm:px-8 sm:pt-6">
      <nav
        data-navbar
        className={`
          mx-auto max-w-5xl w-full h-16 sm:h-20 flex items-center justify-between 
          rounded-full px-6 sm:px-10 shadow-2xl pointer-events-auto
          transition-all duration-500 ease-in-out
          ${
            isScrolled
              ? "bg-main/60 backdrop-blur-xl border border-secnd/10"
              : "bg-transparent border-transparent shadow-none"
          }
        `}
        style={{
          transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          // Fuerza una capa de composición propia en GPU. Sin esto, iOS Safari
          // a veces no repinta elementos position:fixed con backdrop-filter
          // cuando solo cambian las clases (el estado cambia, pero visualmente
          // el fondo se queda "congelado").
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          WebkitBackdropFilter: isScrolled ? "blur(24px)" : "none",
          willChange: "background-color, backdrop-filter",
        }}
      >
        <Link
          href="/"
          className="relative z-10 shrink-0 text-xl font-bold tracking-widest sm:text-2xl text-secnd hover:opacity-80 transition-opacity"
        >
          PROMETHEUS
        </Link>

        {/* Botón de Menú Móvil con soporte táctil mejorado */}
        <button
          type="button"
          aria-label={
            open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
          }
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-10 w-10 items-center justify-center text-xl lg:hidden text-secnd cursor-pointer select-none"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {open ? "✕" : "☰"}
        </button>

        <ul
          className={`
            flex gap-6 items-center
            /* Escritorio */
            lg:z-10 lg:static lg:h-auto lg:w-auto lg:translate-y-0 lg:opacity-100 lg:flex-row lg:bg-transparent lg:p-0 lg:pointer-events-auto
            /* Móvil */
            fixed left-4 right-4 top-24 z-100 flex-col justify-center
            bg-main/95 rounded-3xl p-8 transition-all duration-300 ease-out
            ${
              open
                ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
                : "opacity-0 pointer-events-none -translate-y-4 scale-95 lg:translate-y-0 lg:scale-100"
            }
          `}
        >
          {visibleLinks.map((link) => (
            <li
              key={link.href}
              className="nav-link relative z-20 text-sm sm:text-base"
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 px-1 hover:text-secnd/80 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

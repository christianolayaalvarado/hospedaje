"use client";

import { useEffect, useState } from "react";

const sections = [
  {
    id: "servicios",
    label: "Servicios",
  },
  {
    id: "ubicacion",
    label: "Ubicación",
  },
  {
    id: "contacto",
    label: "Contacto",
  },
];

export default function Navbar() {

  const [scrolled, setScrolled] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("");

  useEffect(() => {

    function handleScroll() {

      setScrolled(window.scrollY > 20);

      const scrollPosition =
        window.scrollY + 120;

      for (const section of sections) {

        const el =
          document.getElementById(section.id);

        if (!el) continue;

        const offsetTop = el.offsetTop;
        const height = el.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + height
        ) {
          setActiveSection(section.id);
        }
      }
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b"
            : "bg-white/40 backdrop-blur-md"
        }
      `}
    >

      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* 🔥 LOGO */}
        <div className="flex items-center gap-2 cursor-pointer">

          <div className="h-9 w-9 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold shadow-md">
            R&E
          </div>

          <div className="hidden sm:block">

            <p className="font-semibold leading-none">
              Hospedaje R&E
            </p>

            <p className="text-xs text-gray-500">
              San Miguel · Lima
            </p>

          </div>

        </div>

        {/* 🔥 NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

          {sections.map((section) => (

            <a
              key={section.id}
              href={`#${section.id}`}
              className={`
                transition
                relative
                hover:text-rose-500
                ${
                  activeSection === section.id
                    ? "text-rose-500"
                    : "text-gray-700"
                }
              `}
            >

              {section.label}

              {/* indicador */}
              <span
                className={`
                  absolute
                  -bottom-2
                  left-0
                  h-[2px]
                  bg-rose-500
                  transition-all duration-300
                  ${
                    activeSection === section.id
                      ? "w-full"
                      : "w-0"
                  }
                `}
              />

            </a>

          ))}

        </nav>

        {/* 🔥 BOTÓN */}
        <button
          className="
            bg-rose-500
            hover:bg-rose-600
            active:scale-95
            transition
            text-white
            px-5 py-2
            rounded-full
            text-sm
            font-medium
            shadow-md
          "
        >
          Reservar
        </button>

      </div>

    </header>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  signOut,
  useSession,
} from "next-auth/react";

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

  const { data: session } =
    useSession();

  const [scrolled, setScrolled] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  // SCROLL
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

  // CERRAR MENU AL HACER CLICK FUERA
  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

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

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >

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

        </Link>

        {/* NAV */}
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

        {/* AUTH */}
        <div className="flex items-center gap-3">

          {!session ? (

            <div className="flex items-center gap-3">

              <Link
                href="/login"
                className="
                  border
                  px-5 py-2
                  rounded-full
                  text-sm
                  font-medium
                  hover:bg-gray-100
                  transition
                "
              >
                Login
              </Link>

              <Link
                href="/register"
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
                Registrarse
              </Link>

            </div>

          ) : (

            <div
              ref={menuRef}
              className="relative flex items-center gap-3"
            >

              {/* USER INFO */}
              <div className="hidden md:flex flex-col items-end leading-tight">

                <span className="text-sm font-medium">
                  {session.user?.name}
                </span>

                <span className="text-xs text-gray-500">
                  {session.user?.email}
                </span>

              </div>

              {/* BOTON MENU + AVATAR */}
              <button
                onClick={() =>
                  setMenuOpen(!menuOpen)
                }
               className="
  flex items-center gap-2
  px-4 py-1.5
  rounded-full
  bg-white/90
  backdrop-blur-xl
  shadow-sm
  hover:shadow-md
  transition-all duration-200
  active:scale-[0.98]
"
              >

                {/* ICONO MENU */}
                <div className="flex flex-col gap-1">

                  <span className="w-4 h-[1.5px] bg-gray-700 rounded-full" />

                  <span className="w-4 h-[1.5px] bg-gray-700 rounded-full" />

                  <span className="w-4 h-[1.5px] bg-gray-700 rounded-full" />

                </div>

                {/* AVATAR */}
                {session.user?.image ? (

                  <img
                    src={session.user.image}
                    alt="avatar"
                    className="
                      h-9 w-9
                      rounded-full
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      h-9 w-9
                      rounded-full
                      bg-gray-200
                      flex items-center justify-center
                    "
                  >
                    👤
                  </div>

                )}

              </button>

              {/* DROPDOWN */}
              {menuOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-14
                    w-64
                    bg-white
                    border
                    rounded-2xl
                    shadow-xl
                    p-2
                    z-50
                    animate-in fade-in zoom-in-95
                  "
                >

                  <div className="px-4 py-3 border-b">

                    <p className="font-medium text-sm">
                      {session.user?.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 break-all">
                      {session.user?.email}
                    </p>

                  </div>

                  <div className="py-2 space-y-1">

                    <Link
                      href="/my-bookings"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="
                        block px-4 py-2
                        rounded-xl
                        hover:bg-gray-100
                        text-sm
                        transition
                      "
                    >
                      Mis reservas
                    </Link>

                    {session.user?.role === "ADMIN" && (

                      <Link
                        href="/admin"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          block px-4 py-2
                          rounded-xl
                          hover:bg-gray-100
                          text-sm
                          transition
                        "
                      >
                        Panel Admin
                      </Link>

                    )}

                  </div>

                  <div className="border-t pt-2">

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="
                        w-full text-left
                        px-4 py-2
                        rounded-xl
                        hover:bg-gray-100
                        text-sm
                        transition
                      "
                    >
                      Cerrar sesión
                    </button>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </header>
  );
}
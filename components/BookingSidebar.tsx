"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CalendarAirbnb from "./CalendarAirbnb";
import { getPrecioPorDia } from "@/lib/pricing";
import MobileBookingBar from "./MobileBookingBar";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
};

export default function BookingSidebar({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) {

  const [open, setOpen] = useState(false);

  // =========================================================
  // 💰 PRECIOS
  // =========================================================

  const cleaningFee = 50;
  const serviceFee = 30;

  // =========================================================
  // 🌙 NOCHES
  // =========================================================

  const nights =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (
              endDate.getTime() -
              startDate.getTime()
            ) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  // =========================================================
  // 💵 TOTAL
  // =========================================================

  const total =
    startDate && endDate
      ? (() => {

          let sum = 0;

          const current =
            new Date(startDate);

          while (current < endDate) {

            sum += getPrecioPorDia(current);

            current.setDate(
              current.getDate() + 1
            );
          }

          return (
            sum +
            cleaningFee +
            serviceFee
          );

        })()
      : 0;

  // =========================================================
  // 🔒 BODY LOCK
  // =========================================================

  useEffect(() => {

    document.body.style.overflow =
      open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow =
        "auto";
    };

  }, [open]);

  return (
    <>

      {/* ========================================================= */}
      {/* 💻 DESKTOP SIDEBAR */}
      {/* ========================================================= */}

      <div className="hidden md:block sticky top-24">

        <div className="border rounded-2xl p-6 shadow-xl space-y-5 bg-white">

          {/* HEADER */}
          <div className="flex items-center justify-between">

            <p className="text-xl font-semibold">

              Desde S/ {getPrecioPorDia(new Date())}

              <span className="text-gray-500 text-base font-normal">
                {" "}
                / noche
              </span>

            </p>

          </div>

          {/* FECHAS */}
          <div
            onClick={() => setOpen(true)}
            className="
              border
              rounded-xl
              overflow-hidden
              cursor-pointer
              hover:border-black
              transition
            "
          >

            <div className="grid grid-cols-2 text-sm">

              <div className="p-3 border-r">

                <p className="text-xs text-gray-500">
                  CHECK-IN
                </p>

                <p className="font-medium">
                  {startDate
                    ? startDate.toLocaleDateString("es-PE")
                    : "Agregar fecha"}
                </p>

              </div>

              <div className="p-3">

                <p className="text-xs text-gray-500">
                  CHECK-OUT
                </p>

                <p className="font-medium">
                  {endDate
                    ? endDate.toLocaleDateString("es-PE")
                    : "Agregar fecha"}
                </p>

              </div>

            </div>

          </div>

          {/* BOTÓN */}
          <button
            className="
              bg-rose-500
              hover:bg-rose-600
              active:scale-95
              transition
              text-white
              py-3
              rounded-xl
              w-full
              font-medium
            "
          >
            Reservar
          </button>

          {/* RESUMEN */}
          {nights > 0 && (

            <div className="text-sm space-y-2 border-t pt-4">

              <div className="flex justify-between">
                <span>{nights} noches</span>
                <span>
                  S/ {total - cleaningFee - serviceFee}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tarifa de limpieza</span>
                <span>S/ {cleaningFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Tarifa de servicio</span>
                <span>S/ {serviceFee}</span>
              </div>

              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>S/ {total}</span>
              </div>

            </div>

          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* 📱 MOBILE BOOKING BAR */}
      {/* ========================================================= */}

      <MobileBookingBar
        price={getPrecioPorDia(new Date())}
        startDate={startDate}
        endDate={endDate}
        onOpen={() => setOpen(true)}
      />

      {/* ========================================================= */}
      {/* 🔥 MODAL / BOTTOM SHEET */}
      {/* ========================================================= */}

      <AnimatePresence>

        {open && (

          <>

            {/* OVERLAY */}
            <motion.div
              className="
                fixed inset-0
                bg-black/40
                backdrop-blur-sm
                z-50
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* BOTTOM SHEET */}
            <motion.div

              className="
                fixed inset-0
                z-50

                flex
                items-end
                md:items-center
                justify-center

                md:p-4
              "

              initial={{
                opacity: 0,
                y:
                  typeof window !== "undefined" &&
                  window.innerWidth < 768
                    ? 80
                    : 0,
                scale:
                  typeof window !== "undefined" &&
                  window.innerWidth >= 768
                    ? 0.96
                    : 1,
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}

              exit={{
                opacity: 0,
                y:
                  typeof window !== "undefined" &&
                  window.innerWidth < 768
                    ? 80
                    : 0,
                scale:
                  typeof window !== "undefined" &&
                  window.innerWidth >= 768
                    ? 0.96
                    : 1,
              }}

              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >

              <div
                className="
                  bg-white

                  w-full
                  md:max-w-3xl

                  h-[92vh]
                  md:h-auto

                  rounded-t-[32px]
                  md:rounded-3xl

                  shadow-2xl

                  flex
                  flex-col

                  overflow-hidden

                  pb-[env(safe-area-inset-bottom)]
                "
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                {/* ========================================================= */}
                {/* 🔥 DRAG HANDLE */}
                {/* ========================================================= */}

                <div className="pt-3 md:hidden">

                  <div
                    className="
                      w-12
                      h-1.5
                      rounded-full
                      bg-gray-300
                      mx-auto
                    "
                  />

                </div>

                {/* ========================================================= */}
                {/* 🔥 HEADER */}
                {/* ========================================================= */}

                <div
                  className="
                    sticky
                    top-0
                    z-20

                    bg-white/95
                    backdrop-blur-md

                    border-b

                    px-4
                    md:px-6

                    pt-4
                    pb-4
                  "
                >

                  <div className="flex justify-between items-start gap-4">

                    <div>

                      <p
                        className="
                          text-lg
                          md:text-2xl
                          font-semibold
                          leading-tight
                        "
                      >

                        {nights > 0
                          ? `${nights} noche${
                              nights > 1
                                ? "s"
                                : ""
                            } en San Miguel`
                          : "Selecciona fechas"}

                      </p>

                      <p className="text-sm text-gray-500 mt-1">

                        {startDate && endDate
                          ? `${startDate.toLocaleDateString("es-PE")} - ${endDate.toLocaleDateString("es-PE")}`
                          : "Agrega tus fechas"}

                      </p>

                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="
                        text-xl
                        hover:scale-110
                        transition
                      "
                    >
                      ✕
                    </button>

                  </div>

                </div>

                {/* ========================================================= */}
                {/* 📅 CALENDARIO */}
                {/* ========================================================= */}

                <div
                  className="
                    flex-1
                    overflow-y-auto
                    overscroll-contain

                    px-4
                    md:px-6

                    py-5
                  "
                >

                  <CalendarAirbnb
                    onChange={({ from, to }) => {

                  setStartDate(from ?? null);
                  setEndDate(to ?? null);

                  // 🔥 auto close al completar rango
                  if (from && to) {

                    setTimeout(() => {
                      setOpen(false);
                    }, 250);

                  }

                }}
                    getPrecioPorDia={getPrecioPorDia}
                  />

                </div>

                {/* ========================================================= */}
                {/* 🔘 FOOTER */}
                {/* ========================================================= */}

                <div
                  className="
                    sticky
                    bottom-0

                    bg-white/95
                    backdrop-blur-md

                    border-t

                    px-4
                    py-4

                    flex
                    justify-between
                    items-center
                    gap-4
                  "
                >

                  <button
                    onClick={() => {

                      setStartDate(null);
                      setEndDate(null);

                    }}
                    className="
                      underline
                      text-sm
                      whitespace-nowrap
                    "
                  >
                    Limpiar fechas
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="
                      bg-black
                      text-white

                      px-6
                      py-3

                      rounded-xl

                      font-medium

                      hover:opacity-90
                      active:scale-95

                      transition
                    "
                  >
                    Aplicar
                  </button>

                </div>

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>

    </>
  );
}
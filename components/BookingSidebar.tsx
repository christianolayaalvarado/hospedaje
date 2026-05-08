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
  // 🛏️ NOCHES
  // =========================================================

  const nights =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) /
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
  // 🔥 LOCK SCROLL
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
      {/* 💻 DESKTOP */}
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
      {/* 🪟 MODAL */}
      {/* ========================================================= */}

      <AnimatePresence>

        {open && (

          <>

            {/* overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* modal */}
            <motion.div
              className="
                fixed inset-0 z-50
                flex items-end md:items-center
                justify-center
              "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >

              <div
                onClick={(e) => e.stopPropagation()}
                className="
                  bg-white
                  w-full
                  md:max-w-3xl

                  rounded-t-3xl
                  md:rounded-2xl

                  shadow-2xl

                  flex flex-col

                  h-[92vh]
                  md:h-auto

                  overflow-hidden
                "
              >

                {/* ========================================================= */}
                {/* HEADER */}
                {/* ========================================================= */}

                <div className="
                  flex justify-between items-start
                  p-5 md:p-6
                  border-b
                  shrink-0
                ">

                  <div className="pr-4">

                    <p className="
                      text-lg md:text-2xl
                      font-semibold
                      leading-tight
                    ">

                      {nights > 0
                        ? `${nights} noche${
                            nights > 1 ? "s" : ""
                          } en San Miguel`
                        : "Selecciona fechas"}

                    </p>

                    <p className="text-sm text-gray-500 mt-1">

                      {startDate && endDate
                        ? `${startDate.toLocaleDateString("es-PE")} - ${endDate.toLocaleDateString("es-PE")}`
                        : "Agrega tus fechas de viaje"}

                    </p>

                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="
                      text-xl
                      h-10 w-10
                      flex items-center justify-center
                      rounded-full
                      hover:bg-gray-100
                      transition
                      shrink-0
                    "
                  >
                    ✕
                  </button>

                </div>

                {/* ========================================================= */}
                {/* CALENDARIO */}
                {/* ========================================================= */}

                <div className="
                  flex-1
                  overflow-y-auto
                  px-4 md:px-6
                  py-4
                ">

                  <CalendarAirbnb
                    onChange={({ from, to }) => {

                      setStartDate(from ?? null);

                      setEndDate(to ?? null);

                    }}
                    getPrecioPorDia={getPrecioPorDia}
                  />

                </div>

                {/* ========================================================= */}
                {/* FOOTER */}
                {/* ========================================================= */}

                <div className="
                  border-t
                  p-4 md:p-6
                  flex justify-between items-center
                  bg-white
                  shrink-0
                ">

                  <button
                    onClick={() => {

                      setStartDate(null);

                      setEndDate(null);

                    }}
                    className="
                      underline
                      text-sm
                      font-medium
                    "
                  >
                    Limpiar fechas
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="
                      bg-black
                      text-white
                      px-6 py-3
                      rounded-xl
                      font-medium
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
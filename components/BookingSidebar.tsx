"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CalendarAirbnb from "./CalendarAirbnb";

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

  // 💰 PRECIO DINÁMICO
  function getPrecioPorDia(date: Date) {
    const day = date.getDay();
    if (day === 0 || day === 6) return 180; // fin de semana
    return 150; // semana
  }

  const cleaningFee = 50;
  const serviceFee = 30;

  // 🛏️ NOCHES
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

  // 💵 TOTAL REAL (tipo Airbnb)
  const total =
    startDate && endDate
      ? (() => {
          let sum = 0;
          const current = new Date(startDate);

          while (current < endDate) {
            sum += getPrecioPorDia(current);
            current.setDate(current.getDate() + 1);
          }

          return sum + cleaningFee + serviceFee;
        })()
      : 0;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-24">
        <div className="border rounded-2xl p-6 shadow-xl space-y-5 bg-white">
          
          {/* 💰 PRECIO HEADER */}
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">
              Desde S/ {getPrecioPorDia(new Date())}
              <span className="text-gray-500 text-base font-normal"> / noche</span>
            </p>
          </div>

          {/* 📅 INPUT FECHAS */}
          <div
            onClick={() => setOpen(true)}
            className="border rounded-xl overflow-hidden cursor-pointer hover:border-black transition"
          >
            <div className="grid grid-cols-2 text-sm">
              <div className="p-3 border-r">
                <p className="text-xs text-gray-500">CHECK-IN</p>
                <p className="font-medium">
                  {startDate
                    ? startDate.toLocaleDateString("es-PE")
                    : "Agregar fecha"}
                </p>
              </div>

              <div className="p-3">
                <p className="text-xs text-gray-500">CHECK-OUT</p>
                <p className="font-medium">
                  {endDate
                    ? endDate.toLocaleDateString("es-PE")
                    : "Agregar fecha"}
                </p>
              </div>
            </div>
          </div>

          {/* 🔘 BOTÓN */}
          <button className="bg-rose-500 hover:bg-rose-600 active:scale-95 transition text-white py-3 rounded-xl w-full font-medium">
            Reservar
          </button>

          {/* 💵 RESUMEN */}
          {nights > 0 && (
            <div className="text-sm space-y-2 border-t pt-4">
              
              <div className="flex justify-between">
                <span>{nights} noches</span>
                <span>S/ {total - cleaningFee - serviceFee}</span>
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

      {/* 🪟 MODAL */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold text-lg">
                      Selecciona tus fechas
                    </p>
                    <p className="text-sm text-gray-500">
                      Precio dinámico por día
                    </p>
                  </div>

                  <button onClick={() => setOpen(false)} className="text-xl">
                    ✕
                  </button>
                </div>

                <CalendarAirbnb
                  onChange={({ from, to }) => {
                    setStartDate(from ?? null);
                    setEndDate(to ?? null);
                  }}
                  getPrecioPorDia={getPrecioPorDia}
                />

                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    className="underline text-sm"
                  >
                    Limpiar fechas
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className="bg-black text-white px-6 py-2 rounded-lg"
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
"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import CalendarAirbnb from "./CalendarAirbnb";
import MobileBookingBar from "./MobileBookingBar";
import ReservationModal from "./ReservationModal";

import { getPrecioPorDia } from "@/lib/pricing";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  propertyId: string;
  expiresAt?: string | null;
};

export default function BookingSidebar({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  propertyId,
  expiresAt,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [refreshKey] = useState(0);

  const cleaningFee = 50;
  const serviceFee = 30;

  // =========================
  // EXPIRATION ENGINE
  // =========================
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // =========================
  // NIGHTS
  // =========================
  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / 86400000
    );
  }, [startDate, endDate]);

  // =========================
  // TOTAL
  // =========================
  const total = useMemo(() => {
    if (!startDate || !endDate) return 0;

    let sum = 0;
    const current = new Date(startDate.getTime());

    while (current < endDate) {
      sum += getPrecioPorDia(current);
      current.setDate(current.getDate() + 1);
    }

    return sum + cleaningFee + serviceFee;
  }, [startDate, endDate]);

  // =========================
  // CAN BOOK (FIX CRÍTICO)
  // =========================
  const canBook = useMemo(() => {
    if (!startDate || !endDate) return false;
    if (loading) return false;
    if (timeLeft <= 0) return false;
    if (endDate <= startDate) return false;

    return true;
  }, [startDate, endDate, loading, timeLeft]);

  // =========================
  // BOOKING
  // =========================
  const handleBooking = async () => {
    if (!canBook) return;

    try {
      setLoading(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate,
          totalPrice: total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error en la reserva");
        return;
      }

      toast.success("Reserva creada correctamente");

      setStartDate(null);
      setEndDate(null);
      setOpen(false);
      setSuccessModal(true);
    } catch (err) {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI (TU DISEÑO ORIGINAL RESTAURADO)
  // =========================
  return (
    <>
      <ReservationModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
      />

      {/* DESKTOP */}
      <div className="hidden md:block sticky top-24">
        <div className="border rounded-2xl p-6 shadow-xl bg-white space-y-5">

          <p className="text-xl font-semibold">
            Desde S/ {getPrecioPorDia(new Date())}{" "}
            <span className="text-gray-500 text-base font-normal">
              / noche
            </span>
          </p>

          {/* COUNTDOWN */}
          {expiresAt && (
            <div className="text-sm font-semibold text-gray-700">
              {timeLeft > 0
                ? `⏳ Expira en ${formatTime(timeLeft)}`
                : "❌ Esta reserva ha expirado"}
            </div>
          )}

          {/* DATES */}
          <div
            onClick={() => setOpen(true)}
            className="border rounded-xl p-3 cursor-pointer"
          >
            <div className="grid grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">CHECK-IN</p>
                <p>
                  {startDate?.toLocaleDateString("es-PE") ||
                    "Agregar fecha"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">CHECK-OUT</p>
                <p>
                  {endDate?.toLocaleDateString("es-PE") ||
                    "Agregar fecha"}
                </p>
              </div>
            </div>
          </div>

          {/* BUTTON (TU DISEÑO ORIGINAL) */}
          <button
            disabled={!canBook}
            onClick={handleBooking}
            className="bg-rose-500 text-white py-3 rounded-xl w-full disabled:opacity-50"
          >
            {loading ? "Reservando..." : "Reservar"}
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <MobileBookingBar
        price={getPrecioPorDia(new Date())}
        startDate={startDate}
        endDate={endDate}
        nights={nights}
        onOpen={() => setOpen(true)}
        onReserve={handleBooking}
      />

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
            />

            <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white w-full md:max-w-3xl rounded-3xl overflow-hidden">

                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">
                    {nights ? `${nights} noches` : "Selecciona fechas"}
                  </h2>

                  <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="p-4">
                  <CalendarAirbnb
                    propertyId={propertyId}
                    selectedRange={{
                      from: startDate ?? undefined,
                      to: endDate ?? undefined,
                    }}
                    onChange={({ from, to }) => {
                      setStartDate(from ?? null);
                      setEndDate(to ?? null);
                    }}
                  />
                </div>

                <div className="p-4 border-t">
                  <button
                    disabled={!canBook}
                    onClick={handleBooking}
                    className="w-full bg-rose-500 text-white py-3 rounded-xl disabled:opacity-50"
                  >
                    {loading ? "Reservando..." : "Reservar"}
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
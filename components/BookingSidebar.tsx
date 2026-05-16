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
  const [refreshKey, setRefreshKey] = useState(0);

  const cleaningFee = 50;
  const serviceFee = 30;

  // =========================
  // COUNTDOWN EXPIRATION (AIRBNB PRO UX)
  // =========================
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculate = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    calculate();

    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const urgency = useMemo(() => {
    const minutes = timeLeft / 60000;

    if (minutes <= 5) return "critical";
    if (minutes <= 10) return "danger";
    if (minutes <= 30) return "warning";
    return "safe";
  }, [timeLeft]);

  // =========================
  // NOCHES
  // =========================
  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [startDate, endDate]);

  // =========================
  // TOTAL
  // =========================
  const total = useMemo(() => {
    if (!startDate || !endDate) return 0;

    let sum = 0;
    const current = new Date(startDate);

    while (current < endDate) {
      sum += getPrecioPorDia(current);
      current.setDate(current.getDate() + 1);
    }

    return sum + cleaningFee + serviceFee;
  }, [startDate, endDate]);

  // =========================
  // BOOKING
  // =========================
  async function handleBooking() {
    if (!startDate || !endDate || loading || timeLeft === 0) return;

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
        toast.error(data.error || "No se pudo realizar la reserva");
        return;
      }

      toast.success("Reserva creada correctamente");

      setStartDate(null);
      setEndDate(null);

      setOpen(false);
      setSuccessModal(true);
      setRefreshKey((v) => v + 1);
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado al crear reserva");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* SUCCESS MODAL */}
      <ReservationModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
      />

      {/* DESKTOP */}
      <div className="hidden md:block sticky top-24">
        <div className="border rounded-2xl p-6 shadow-xl bg-white space-y-5">

          <p className="text-xl font-semibold">
            Desde S/ {getPrecioPorDia(new Date())}
            <span className="text-gray-500 text-base font-normal">
              {" "} / noche
            </span>
          </p>

          {/* COUNTDOWN */}
          {expiresAt && (
            <div
              className={`
                text-sm font-semibold transition
                ${
                  urgency === "safe"
                    ? "text-green-600"
                    : urgency === "warning"
                    ? "text-yellow-600"
                    : urgency === "danger"
                    ? "text-red-500"
                    : "text-red-600 animate-pulse"
                }
              `}
            >
              {timeLeft > 0 ? (
                <>⏳ Expira en {formatTime(timeLeft)}</>
              ) : (
                <>❌ Esta reserva ha expirado</>
              )}
            </div>
          )}

          <div
            onClick={() => setOpen(true)}
            className="border rounded-xl p-3 cursor-pointer"
          >
            <div className="grid grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">CHECK-IN</p>
                <p>{startDate?.toLocaleDateString("es-PE") || "Agregar fecha"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">CHECK-OUT</p>
                <p>{endDate?.toLocaleDateString("es-PE") || "Agregar fecha"}</p>
              </div>
            </div>
          </div>

          <button
            disabled={!startDate || !endDate || loading || timeLeft === 0}
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
                  <div>
                    <h2 className="text-lg font-semibold">
                      {nights > 0 ? `${nights} noches` : "Selecciona fechas"}
                    </h2>

                    {expiresAt && (
                      <p className={urgency === "critical"
                        ? "text-red-600 animate-pulse text-sm"
                        : "text-sm text-red-500"}
                      >
                        ⏳ Expira en {formatTime(timeLeft)}
                      </p>
                    )}
                  </div>

                  <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="p-4">
                  <CalendarAirbnb
                    key={refreshKey}
                    selectedRange={{
                      from: startDate ?? undefined,
                      to: endDate ?? undefined,
                    }}
                    onChange={({ from, to }) => {
                      setStartDate(from ?? null);
                      setEndDate(to ?? null);
                    }}
                    getPrecioPorDia={getPrecioPorDia}
                  />
                </div>

                <div className="p-4 border-t">
                  <button
                    disabled={!startDate || !endDate || loading || timeLeft === 0}
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
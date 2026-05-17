"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import CalendarAirbnb from "./CalendarAirbnb";
import MobileBookingBar from "./MobileBookingBar";
import ReservationModal from "./ReservationModal";

import { useCountdown } from "@/hooks/useCountdown";

const PRICE_PER_NIGHT = 120;
const CLEANING_FEE = 50;
const SERVICE_FEE = 30;

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

  const [discountCode, setDiscountCode] = useState("");

  const [discountApplied, setDiscountApplied] = useState(0);

  const countdown = useCountdown(expiresAt);

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / 86400000
    );
  }, [startDate, endDate]);

  const subtotal = useMemo(() => {
    return nights * PRICE_PER_NIGHT;
  }, [nights]);

  const total = useMemo(() => {
    return Math.max(
      0,
      subtotal + CLEANING_FEE + SERVICE_FEE - discountApplied
    );
  }, [subtotal, discountApplied]);

  const canBook = useMemo(() => {
    if (!startDate || !endDate) return false;

    if (loading) return false;

    if (endDate <= startDate) return false;

    if (expiresAt && countdown === "Expirada") {
      return false;
    }

    return true;
  }, [
    startDate,
    endDate,
    loading,
    expiresAt,
    countdown,
  ]);

  useEffect(() => {
    setDiscountApplied(0);
  }, [startDate, endDate]);

  const applyDiscountPreview = () => {
    const code = discountCode.trim().toUpperCase();

    if (!code) {
      toast.error("Ingresa un código");
      return;
    }

    if (code === "SOCIOS10") {
      setDiscountApplied(subtotal * 0.1);
      toast.success("Descuento aplicado");
      return;
    }

    if (code === "AMIGOS50") {
      setDiscountApplied(50);
      toast.success("Descuento aplicado");
      return;
    }

    toast.error("Código inválido");
  };

  const handleBooking = async () => {
    if (!canBook) return;

    try {
      setLoading(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate,
          discountCode,
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

      setDiscountCode("");
      setDiscountApplied(0);

      setOpen(false);
      setSuccessModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ReservationModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
      />

      <div className="hidden md:block sticky top-24">
        <div className="border rounded-2xl p-6 shadow-xl bg-white space-y-5">
          <p className="text-xl font-semibold">
            Desde S/ {PRICE_PER_NIGHT}
            <span className="text-gray-500 text-base font-normal">
              {" "}/ noche
            </span>
          </p>

          {expiresAt && (
            <div className="text-sm font-semibold text-gray-700">
              {countdown === "Expirada"
                ? "❌ Reserva expirada"
                : `⏳ Expira en ${countdown}`}
            </div>
          )}

          <div
            onClick={() => setOpen(true)}
            className="border rounded-xl p-3 cursor-pointer"
          >
            <div className="grid grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">
                  CHECK-IN
                </p>

                <p>
                  {startDate?.toLocaleDateString("es-PE") ||
                    "Agregar fecha"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  CHECK-OUT
                </p>

                <p>
                  {endDate?.toLocaleDateString("es-PE") ||
                    "Agregar fecha"}
                </p>
              </div>
            </div>
          </div>

          {nights > 0 && (
            <div className="space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>
                  S/ {PRICE_PER_NIGHT} × {nights} noches
                </span>
                <span>S/ {subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Limpieza</span>
                <span>S/ {CLEANING_FEE}</span>
              </div>

              <div className="flex justify-between">
                <span>Servicio</span>
                <span>S/ {SERVICE_FEE}</span>
              </div>

              {discountApplied > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Descuento</span>
                  <span>- S/ {discountApplied}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Código de descuento"
              value={discountCode}
              onChange={(e) =>
                setDiscountCode(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

            <button
              type="button"
              onClick={applyDiscountPreview}
              className="w-full border rounded-xl py-3 font-medium"
            >
              Aplicar código
            </button>
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>S/ {total}</span>
          </div>

          <button
            disabled={!canBook}
            onClick={handleBooking}
            className="bg-rose-500 text-white py-3 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Reservando..." : "Reservar"}
          </button>
        </div>
      </div>

      <MobileBookingBar
        price={PRICE_PER_NIGHT}
        total={total}
        startDate={startDate}
        endDate={endDate}
        nights={nights}
        loading={loading}
        onOpen={() => setOpen(true)}
        onReserve={handleBooking}
      />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="
                  bg-white
                  w-full
                  md:max-w-4xl
                  md:rounded-3xl
                  rounded-t-3xl
                  overflow-hidden
                  flex
                  flex-col
                  max-h-[92vh]
                "
              >
                <div className="sticky top-0 bg-white z-20 border-b p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="font-semibold text-lg">
                        {nights
                          ? `${nights} noches`
                          : "Selecciona fechas"}
                      </h2>

                      {startDate && endDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          {startDate.toLocaleDateString("es-PE")} - {" "}
                          {endDate.toLocaleDateString("es-PE")}
                        </p>
                      )}

                      {nights > 0 && (
                        <div className="text-sm mt-2 font-medium">
                          Total: S/ {total}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 p-4 pb-40 md:pb-4">
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

                  {nights > 0 && (
                    <div className="mt-6 space-y-4 border-t pt-4">
                      <input
                        type="text"
                        placeholder="Código de descuento"
                        value={discountCode}
                        onChange={(e) =>
                          setDiscountCode(e.target.value)
                        }
                        className="w-full rounded-xl border p-4"
                      />

                      <button
                        type="button"
                        onClick={applyDiscountPreview}
                        className="w-full border rounded-xl py-4 font-medium"
                      >
                        Aplicar código
                      </button>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white border-t p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] z-20">
                  <button
                    disabled={!canBook}
                    onClick={handleBooking}
                    className="w-full bg-rose-500 text-white py-4 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Reservando..." : `Reservar · S/ ${total}`}
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

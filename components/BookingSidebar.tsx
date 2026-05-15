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
};

export default function BookingSidebar({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  propertyId,
}: Props) {

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [successModal, setSuccessModal] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const cleaningFee = 50;
  const serviceFee = 30;

  // =========================
  // NOCHES
  // =========================

  const nights = useMemo(() => {

    if (!startDate || !endDate) return 0;

    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
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

    return (
      sum +
      cleaningFee +
      serviceFee
    );

  }, [startDate, endDate]);

  // =========================
  // BLOQUEAR SCROLL BODY
  // =========================

  useEffect(() => {

    document.body.style.overflow =
      open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [open]);

  // =========================
  // RESERVAR
  // =========================

  async function handleBooking() {

    if (
      !startDate ||
      !endDate ||
      loading
    ) return;

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
          totalPrice: total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {

        toast.error(
          data.error ||
          "No se pudo realizar la reserva"
        );

        return;
      }

      toast.success(
        "Reserva creada correctamente"
      );

      // RESET

      setStartDate(null);
      setEndDate(null);

      setOpen(false);

      setSuccessModal(true);

      setRefreshKey((v) => v + 1);

    } catch (error) {

      console.error(error);

      toast.error(
        "Error inesperado al crear reserva"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <>

      {/* ================================= */}
      {/* SUCCESS MODAL */}
      {/* ================================= */}

      <ReservationModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
      />

      {/* ================================= */}
      {/* DESKTOP */}
      {/* ================================= */}

      <div className="hidden md:block sticky top-24">

        <div
          className="
            border
            rounded-2xl
            p-6
            shadow-xl
            bg-white
            space-y-5
          "
        >

          {/* PRICE */}

          <div>

            <p className="text-xl font-semibold">

              Desde S/ {getPrecioPorDia(new Date())}

              <span
                className="
                  text-gray-500
                  text-base
                  font-normal
                "
              >
                {" "} / noche
              </span>

            </p>

            <p className="text-sm text-gray-500 mt-1">

              {startDate && endDate
                ? `${startDate.toLocaleDateString("es-PE")} - ${endDate.toLocaleDateString("es-PE")}`
                : "Selecciona fechas"}

            </p>

          </div>

          {/* SELECTOR */}

          <div
            onClick={() => setOpen(true)}
            className="
              border
              rounded-xl
              p-3
              cursor-pointer
              hover:border-black
              transition
            "
          >

            <div className="grid grid-cols-2 text-sm">

              <div className="border-r pr-3">

                <p className="text-xs text-gray-500">
                  CHECK-IN
                </p>

                <p>
                  {startDate?.toLocaleDateString("es-PE")
                    || "Agregar fecha"}
                </p>

              </div>

              <div className="pl-3">

                <p className="text-xs text-gray-500">
                  CHECK-OUT
                </p>

                <p>
                  {endDate?.toLocaleDateString("es-PE")
                    || "Agregar fecha"}
                </p>

              </div>

            </div>

          </div>

          {/* BUTTON */}

          <button
            disabled={
              !startDate ||
              !endDate ||
              loading
            }
            onClick={handleBooking}
            className="
              bg-rose-500
              hover:bg-rose-600
              disabled:bg-gray-300
              disabled:cursor-not-allowed
              text-white
              py-3
              rounded-xl
              w-full
              font-medium
              transition
            "
          >

            {loading
              ? "Reservando..."
              : "Reservar"}

          </button>

          {/* DESKTOP RESUMEN */}

          {nights > 0 && (

            <div className="border-t pt-4 space-y-2 text-sm">

              <div className="flex justify-between">
                <span>
                  {nights} noche{nights > 1 ? "s" : ""}
                </span>

                <span>
                  S/ {total - cleaningFee - serviceFee}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Limpieza</span>
                <span>S/ {cleaningFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Servicio</span>
                <span>S/ {serviceFee}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>S/ {total}</span>
              </div>

            </div>

          )}

        </div>

      </div>

      {/* ================================= */}
      {/* MOBILE BAR */}
      {/* ================================= */}

      <MobileBookingBar
        price={getPrecioPorDia(new Date())}
        startDate={startDate}
        endDate={endDate}
        onOpen={() => setOpen(true)}
      />

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      <AnimatePresence>

        {open && (

          <>

            {/* BACKDROP */}

            <motion.div
              className="
                fixed
                inset-0
                bg-black/40
                z-50
                backdrop-blur-sm
              "
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* MODAL */}

            <motion.div
              className="
                fixed
                inset-0
                z-50
                flex
                items-end
                md:items-center
                justify-center
              "
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.22 }}
            >

              <div
                className="
                  bg-white
                  w-full
                  md:max-w-3xl
                  rounded-t-3xl
                  md:rounded-3xl
                  overflow-hidden
                  shadow-2xl
                  flex
                  flex-col
                  h-[92vh]
                  md:h-auto
                "
              >

                {/* DRAG INDICATOR MOBILE */}

                <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-gray-300" />
                </div>

                {/* HEADER */}

                <div
                  className="
                    px-5
                    pb-4
                    pt-2
                    border-b
                    flex
                    justify-between
                    items-start
                    shrink-0
                    bg-white
                    sticky
                    top-0
                    z-10
                  "
                >

                  <div>

                    <h2 className="text-xl font-semibold">

                      {nights > 0
                        ? `${nights} noche${nights > 1 ? "s" : ""}`
                        : "Selecciona fechas"}

                    </h2>

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
                      hover:opacity-70
                      transition
                      w-10
                      h-10
                      flex
                      items-center
                      justify-center
                      rounded-full
                      hover:bg-gray-100
                    "
                  >
                    ✕
                  </button>

                </div>

                {/* CALENDAR */}

                <div
                  className="
                    flex-1
                    overflow-y-auto
                    px-4
                    pt-3
                    pb-2
                  "
                >

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

                {/* FOOTER */}

                <div
                  className="
                    border-t
                    p-4
                    bg-white
                    shrink-0
                    sticky
                    bottom-0
                    shadow-[0_-6px_20px_rgba(0,0,0,0.04)]
                  "
                >

                  {/* RESUMEN */}

                  {nights > 0 && (

                    <div className="flex justify-end mb-4">

                      <div
                        className="
                          w-full
                          max-w-[260px]
                          rounded-2xl
                          border
                          bg-gray-50
                          p-4
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                            mb-3
                          "
                        >
                          Resumen de reserva
                        </p>

                        <div className="space-y-2 text-sm">

                          <div className="flex items-center justify-between gap-4">

                            <span className="text-gray-600">
                              {nights} noche{nights > 1 ? "s" : ""}
                            </span>

                            <span className="font-medium">
                              S/ {total - cleaningFee - serviceFee}
                            </span>

                          </div>

                          <div className="flex items-center justify-between gap-4">

                            <span className="text-gray-600">
                              Limpieza
                            </span>

                            <span className="font-medium">
                              S/ {cleaningFee}
                            </span>

                          </div>

                          <div className="flex items-center justify-between gap-4">

                            <span className="text-gray-600">
                              Servicio
                            </span>

                            <span className="font-medium">
                              S/ {serviceFee}
                            </span>

                          </div>

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-4
                              border-t
                              pt-3
                              mt-3
                              font-semibold
                              text-base
                            "
                          >

                            <span>Total</span>

                            <span>S/ {total}</span>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                  {/* INFO */}

                  <p className="text-xs text-gray-500 mb-3 text-center">
                    La reserva no queda confirmada hasta validar el pago.
                  </p>

                  {/* BUTTON */}

                  <button
                    disabled={
                      !startDate ||
                      !endDate ||
                      loading
                    }
                    onClick={handleBooking}
                    className="
                      w-full
                      bg-rose-500
                      hover:bg-rose-600
                      active:scale-[0.99]
                      disabled:bg-gray-300
                      disabled:cursor-not-allowed
                      text-white
                      py-4
                      rounded-2xl
                      font-semibold
                      transition
                    "
                  >

                    {loading
                      ? "Reservando..."
                      : "Reservar"}

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

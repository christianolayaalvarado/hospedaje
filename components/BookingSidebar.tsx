"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CalendarAirbnb from "./CalendarAirbnb";
import MobileBookingBar from "./MobileBookingBar";
import ReservationModal from "./ReservationModal";

import { getPrecioPorDia } from "@/lib/pricing";

import { toast } from "sonner";

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

  const [loading, setLoading] =
    useState(false);

  const [successModal, setSuccessModal] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const cleaningFee = 50;
  const serviceFee = 30;

  const nights =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() -
            startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const total =
    startDate && endDate
      ? (() => {
          let sum = 0;

          const current =
            new Date(startDate);

          while (current < endDate) {
            sum +=
              getPrecioPorDia(current);

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

  useEffect(() => {
    document.body.style.overflow =
      open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [open]);

  async function handleBooking() {
    if (
      !startDate ||
      !endDate ||
      loading
    )
      return;

    try {
      setLoading(true);

      const res = await fetch(
        "/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            startDate,
            endDate,
            totalPrice: total,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error ||
            "No se pudo realizar la reserva"
        );

        return;
      }

      toast.success(
        "Reserva realizada correctamente"
      );

      setStartDate(null);
      setEndDate(null);

      setOpen(false);

      setSuccessModal(true);

      // refresca calendario
      setRefreshKey((v) => v + 1);

    } catch (e) {
      console.error(e);

      toast.error(
        "Ocurrió un error inesperado"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ReservationModal
        open={successModal}
        onClose={() =>
          setSuccessModal(false)
        }
      />

      {/* DESKTOP */}
      <div className="hidden md:block sticky top-24">

        <div className="border rounded-2xl p-6 shadow-xl bg-white space-y-5">

          <div>

            <p className="text-xl font-semibold">

              Desde S/{" "}
              {getPrecioPorDia(new Date())}

              <span className="text-gray-500 text-base font-normal">
                {" "}
                / noche
              </span>

            </p>

            <p className="text-sm text-gray-500 mt-1">

              {startDate && endDate
                ? `${startDate.toLocaleDateString(
                    "es-PE"
                  )} - ${endDate.toLocaleDateString(
                    "es-PE"
                  )}`
                : "Selecciona fechas"}

            </p>

          </div>

          <div
            onClick={() =>
              setOpen(true)
            }
            className="border rounded-xl p-3 cursor-pointer hover:border-black transition"
          >

            <div className="grid grid-cols-2 text-sm">

              <div className="border-r pr-3">

                <p className="text-xs text-gray-500">
                  CHECK-IN
                </p>

                <p>
                  {startDate?.toLocaleDateString(
                    "es-PE"
                  ) || "Agregar fecha"}
                </p>

              </div>

              <div className="pl-3">

                <p className="text-xs text-gray-500">
                  CHECK-OUT
                </p>

                <p>
                  {endDate?.toLocaleDateString(
                    "es-PE"
                  ) || "Agregar fecha"}
                </p>

              </div>

            </div>

          </div>

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
              active:scale-[0.98]
              transition
              text-white
              py-3
              rounded-xl
              w-full
              font-medium
            "
          >

            {loading
              ? "Reservando..."
              : "Reservar"}

          </button>

          {nights > 0 && (

            <div className="text-sm border-t pt-4 space-y-2">

              <div className="flex justify-between">
                <span>
                  {nights} noche
                  {nights > 1
                    ? "s"
                    : ""}
                </span>

                <span>
                  S/{" "}
                  {total -
                    cleaningFee -
                    serviceFee}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Limpieza</span>
                <span>
                  S/ {cleaningFee}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Servicio</span>
                <span>
                  S/ {serviceFee}
                </span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">

                <span>Total</span>

                <span>
                  S/ {total}
                </span>

              </div>

            </div>

          )}
        </div>
      </div>

      {/* MOBILE */}
      <MobileBookingBar
        price={getPrecioPorDia(new Date())}
        startDate={startDate}
        endDate={endDate}
        onOpen={() => setOpen(true)}
      />

      {/* MODAL */}
      <AnimatePresence>

        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() =>
                setOpen(false)
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 30,
              }}
            >

              <div className="bg-white w-full md:max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                <div className="p-5 border-b flex justify-between items-start">

                  <div>

                    <h2 className="text-xl font-semibold">

                      {nights > 0
                        ? `${nights} noche${
                            nights > 1
                              ? "s"
                              : ""
                          } en Hospedaje en San Miguel`
                        : "Selecciona fechas"}

                    </h2>

                    <p className="text-sm text-gray-500">

                      {startDate &&
                      endDate
                        ? `${startDate.toLocaleDateString(
                            "es-PE"
                          )} - ${endDate.toLocaleDateString(
                            "es-PE"
                          )}`
                        : "Agrega tus fechas"}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setOpen(false)
                    }
                    className="text-xl hover:opacity-70 transition"
                  >
                    ✕
                  </button>

                </div>

                <div className="flex-1 overflow-y-auto p-4">

                  <CalendarAirbnb
                    key={refreshKey}
                    selectedRange={{
                      from:
                        startDate ??
                        undefined,

                      to:
                        endDate ??
                        undefined,
                    }}

                    onChange={({
                      from,
                      to,
                    }) => {

                      setStartDate(
                        from ?? null
                      );

                      setEndDate(
                        to ?? null
                      );

                      if (from && to) {
                        setTimeout(() => {
                          setOpen(false);
                        }, 600);
                      }
                    }}

                    getPrecioPorDia={
                      getPrecioPorDia
                    }
                  />

                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
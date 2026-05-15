"use client";

import { useMemo } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import CancelBookingButton from "@/components/CancelBookingButton";

type Props = {
  booking: any;
};

export default function BookingCard({ booking }: Props) {
  const timeLeft = useCountdown(booking.expiresAt);

  // =========================
  // NIGHTS CALC
  // =========================
  const nights = useMemo(() => {
    return Math.ceil(
      (new Date(booking.endDate).getTime() -
        new Date(booking.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, [booking]);

  // =========================
  // STATUS STYLES (AIRBNB STYLE)
  // =========================
  function getStatusStyles(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";

      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";

      case "PAYMENT_REVIEW":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700 border-gray-300";

      case "EXPIRED":
        return "bg-orange-100 text-orange-700 border-orange-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  // =========================
  // STATUS TEXT (UX FRIENDLY)
  // =========================
  function getStatusText(status: string) {
    switch (status) {
      case "APPROVED":
        return "Reserva confirmada";

      case "REJECTED":
        return "Reserva rechazada";

      case "PAYMENT_REVIEW":
        return "Pago en revisión";

      case "PENDING_PAYMENT":
        return "Pendiente de pago";

      case "CANCELLED":
        return "Cancelada";

      case "EXPIRED":
        return "Expirada";

      default:
        return "Estado desconocido";
    }
  }

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {booking.property?.title || "Hospedaje"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Reserva creada el{" "}
            {new Date(booking.createdAt).toLocaleDateString("es-PE")}
          </p>
        </div>

        {/* STATUS BADGE */}
        <span
          className={`px-4 py-2 rounded-full text-xs font-medium border ${getStatusStyles(
            booking.status
          )}`}
        >
          {getStatusText(booking.status)}
        </span>
      </div>

      {/* =========================
          COUNTDOWN
      ========================= */}
      {booking.status === "PENDING_PAYMENT" && booking.expiresAt && (
        <div className="mt-3 text-yellow-700 font-semibold text-sm">
          ⏳ Expira en: {timeLeft || "calculando..."}
        </div>
      )}

      {/* =========================
          INFO GRID
      ========================= */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-sm">

        <div className="bg-gray-50 border rounded-xl p-3">
          <p className="text-gray-500">Check-in</p>
          <p className="font-semibold">
            {new Date(booking.startDate).toLocaleDateString("es-PE")}
          </p>
        </div>

        <div className="bg-gray-50 border rounded-xl p-3">
          <p className="text-gray-500">Check-out</p>
          <p className="font-semibold">
            {new Date(booking.endDate).toLocaleDateString("es-PE")}
          </p>
        </div>

        <div className="bg-gray-50 border rounded-xl p-3">
          <p className="text-gray-500">Noches</p>
          <p className="font-semibold">{nights}</p>
        </div>

      </div>

      {/* =========================
          TOTAL
      ========================= */}
      <div className="mt-5 flex justify-between items-center">
        <p className="text-gray-500 text-sm">Total pagado</p>

        <p className="text-3xl font-bold text-emerald-600">
          S/ {booking.totalPrice}
        </p>
      </div>

      {/* =========================
          ACTIONS
      ========================= */}
      <div className="flex gap-3 mt-6 flex-wrap">

        {/* UPLOAD PROOF */}
        {booking.status === "PENDING_PAYMENT" && (
          <a
            href={`/my-bookings/${booking.id}/upload-proof`}
            className="bg-black text-white px-5 py-3 rounded-xl text-sm hover:bg-gray-800 transition"
          >
            Subir comprobante
          </a>
        )}

        {/* CANCEL */}
        {(booking.status === "PENDING_PAYMENT" ||
          booking.status === "PAYMENT_REVIEW") && (
          <CancelBookingButton bookingId={booking.id} />
        )}

      </div>

    </div>
  );
}
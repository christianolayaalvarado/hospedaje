"use client";

import { useCountdown } from "@/hooks/useCountdown";
import CancelBookingButton from "@/components/CancelBookingButton";

export default function BookingCard({ booking }) {
  const timeLeft = useCountdown(booking.expiresAt);

  const nights = Math.ceil(
    (new Date(booking.endDate).getTime() -
      new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  function getStatusStyles(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "PAYMENT_REVIEW":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-gray-200 text-gray-700";
      case "EXPIRED":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "APPROVED":
        return "Aprobada";
      case "REJECTED":
        return "Rechazada";
      case "PAYMENT_REVIEW":
        return "Pago en revisión";
      case "CANCELLED":
        return "Cancelada";
      case "EXPIRED":
        return "Expirada";
      default:
        return "Pendiente de pago";
    }
  }

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-900">
        {booking.property?.title || "Hospedaje"}
      </h2>

      <p className="text-gray-500 mt-1">
        Reserva realizada el{" "}
        {new Date(booking.createdAt).toLocaleDateString("es-PE")}
      </p>

      {/* COUNTDOWN */}
      {booking.status === "PENDING_PAYMENT" && booking.expiresAt && (
        <div className="mt-2 text-yellow-600 font-semibold">
          ⏳ Expira en: {timeLeft}
        </div>
      )}

      {/* INFO GRID */}
      <div className="grid grid-cols-3 gap-4 mt-5 text-sm">

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

      {/* TOTAL */}
      <p className="text-3xl font-bold text-emerald-600 mt-5">
        S/ {booking.totalPrice}
      </p>

      {/* STATUS */}
      <span
        className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyles(
          booking.status
        )}`}
      >
        {getStatusText(booking.status)}
      </span>

      {/* BOTONES */}
      <div className="flex gap-3 mt-5 flex-wrap">

        {booking.status === "PENDING_PAYMENT" && (
          <a
            href={`/my-bookings/${booking.id}/upload-proof`}
            className="bg-black text-white px-5 py-3 rounded-xl text-sm"
          >
            Subir comprobante
          </a>
        )}

        {(booking.status === "PENDING_PAYMENT" ||
          booking.status === "PAYMENT_REVIEW") && (
          <CancelBookingButton bookingId={booking.id} />
        )}

      </div>

    </div>
  );
}
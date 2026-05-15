"use client";

import { useState } from "react";

export default function AdminBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(action: "APPROVE" | "REJECT") {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error");
        return;
      }

      setMessage(
        action === "APPROVE"
          ? "Reserva aprobada correctamente"
          : "Reserva rechazada correctamente"
      );

      setTimeout(() => {
        setOpen(false);
        setMessage(null);
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  // Solo permitir acciones en estos estados
  if (
    status !== "PAYMENT_REVIEW" &&
    status !== "PENDING_PAYMENT"
  ) {
    return null;
  }

  return (
    <>
      {/* BOTÓN ABRIR MODAL */}
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue-600 hover:underline mt-1"
      >
        Gestionar
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6">

            <h2 className="text-lg font-semibold mb-2">
              Acción de reserva
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Selecciona qué deseas hacer con esta reserva.
            </p>

            {message && (
              <div className="mb-4 text-sm text-center bg-gray-100 text-gray-700 p-2 rounded-lg">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-2">

              <button
                disabled={loading}
                onClick={() => handleAction("APPROVE")}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Aprobar
              </button>

              <button
                disabled={loading}
                onClick={() => handleAction("REJECT")}
                className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Rechazar
              </button>

              <button
                onClick={() => setOpen(false)}
                className="mt-2 text-sm text-gray-500 hover:underline"
              >
                Cancelar
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
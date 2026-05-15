"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  bookingId: string;
};

export default function CancelBookingButton({ bookingId }: Props) {
  const [loading, setLoading] = useState(false);

  // =========================
  // CANCEL BOOKING
  // =========================
  async function handleCancel() {
    if (loading) return; // 🔥 evita doble click

    const confirm = window.confirm(
      "¿Estás seguro de que quieres cancelar esta reserva?"
    );

    if (!confirm) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "No se pudo cancelar la reserva");
        return;
      }

      toast.success("Reserva cancelada correctamente");

      // 🔥 refresco simple (SSR revalidation indirecta)
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al cancelar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="
        px-5 py-3 rounded-xl text-sm font-medium
        border border-red-200
        text-red-600
        hover:bg-red-50
        disabled:opacity-50
        disabled:cursor-not-allowed
        transition
      "
    >
      {loading ? "Cancelando..." : "Cancelar reserva"}
    </button>
  );
}
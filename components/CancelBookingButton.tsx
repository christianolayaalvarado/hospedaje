"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  bookingId: string;
};

export default function CancelBookingButton({
  bookingId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleCancel() {

    const confirmDelete =
      confirm(
        "¿Deseas cancelar esta reserva?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `/api/bookings/${bookingId}/cancel`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(
          data.error ||
          "Error cancelando reserva"
        );

        return;
      }

      alert(
        "Reserva cancelada correctamente"
      );

      router.refresh();

    } catch (error) {

      console.error(error);

      alert(
        "Ocurrió un error"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="
        border
        border-red-200
        text-red-600
        hover:bg-red-50
        px-5
        py-3
        rounded-xl
        text-sm
        font-medium
        transition
        disabled:opacity-50
      "
    >

      {loading
        ? "Cancelando..."
        : "Cancelar reserva"}

    </button>

  );

}
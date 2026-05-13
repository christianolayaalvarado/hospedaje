"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

type Props = {
  bookingId: string;
  currentStatus: string;
};

export default function AdminBookingActions({
  bookingId,
  currentStatus,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function updateStatus(
    status: "APPROVED" | "REJECTED"
  ) {

    try {

      setLoading(true);

      const res = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Reserva actualizada");

      router.refresh();

    } catch (error: any) {

      toast.error(error.message);

    } finally {

      setLoading(false);

    }

  }

  if (currentStatus !== "PENDING") {

    return (
      <p className="text-sm text-gray-400">
        Sin acciones
      </p>
    );

  }

  return (
    <div className="flex gap-2">

      <button
        disabled={loading}
        onClick={() => updateStatus("APPROVED")}
        className="
          px-4 py-2 rounded-xl
          bg-green-500
          hover:bg-green-600
          text-white text-sm font-medium
          transition
        "
      >
        Aprobar
      </button>

      <button
        disabled={loading}
        onClick={() => updateStatus("REJECTED")}
        className="
          px-4 py-2 rounded-xl
          bg-red-500
          hover:bg-red-600
          text-white text-sm font-medium
          transition
        "
      >
        Rechazar
      </button>

    </div>
  );
}
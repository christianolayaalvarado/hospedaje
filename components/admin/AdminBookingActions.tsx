"use client";

import { useState } from "react";

export default function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "APPROVE" | "REJECT") {
    try {
      setLoading(true);

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
        alert(data.error || "Error");
        return;
      }

      alert("Acción realizada");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (
    status !== "PAYMENT_REVIEW" &&
    status !== "PENDING_PAYMENT"
  ) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => handleAction("APPROVE")}
        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
      >
        Aprobar
      </button>

      <button
        disabled={loading}
        onClick={() => handleAction("REJECT")}
        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
      >
        Rechazar
      </button>
    </div>
  );
}
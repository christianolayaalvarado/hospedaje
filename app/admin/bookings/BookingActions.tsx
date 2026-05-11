"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  bookingId: string;
  currentStatus: string;
};

export default function BookingActions({
  bookingId,
  currentStatus,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {

    try {

      setLoading(true);

      const res = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Reserva actualizada");

      router.refresh();

    } catch (e: any) {

      toast.error(e.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="flex gap-2">

      <button
        disabled={
          loading ||
          currentStatus === "APPROVED"
        }
        onClick={() => updateStatus("APPROVED")}
        className="
          px-4 py-2 rounded-xl text-sm font-medium
          bg-green-500 text-white
          disabled:opacity-50
        "
      >
        Aprobar
      </button>

      <button
        disabled={
          loading ||
          currentStatus === "REJECTED"
        }
        onClick={() => updateStatus("REJECTED")}
        className="
          px-4 py-2 rounded-xl text-sm font-medium
          bg-red-500 text-white
          disabled:opacity-50
        "
      >
        Rechazar
      </button>

    </div>
  );
}
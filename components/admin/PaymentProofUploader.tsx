"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  bookingId: string;
  onUploaded?: () => void;
};

export default function PaymentProofUploader({ bookingId, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("bookingId", bookingId);

      const res = await fetch("/api/bookings/upload-proof", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al subir comprobante");
        return;
      }

      toast.success("Comprobante enviado para revisión");

      onUploaded?.();
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded-xl space-y-2">
      <p className="font-medium">Subir comprobante de pago</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={loading}
      />

      {loading && (
        <p className="text-sm text-gray-500">Subiendo...</p>
      )}
    </div>
  );
}
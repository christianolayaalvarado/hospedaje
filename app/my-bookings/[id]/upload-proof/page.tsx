"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadProofPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file || loading) return;

    try {
      setLoading(true);

      // ⚠️ SIMULACIÓN: en producción usarías S3 / Cloudinary
      const fakeUrl = URL.createObjectURL(file);

      const res = await fetch("/api/bookings/upload-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: params.id,
          paymentProof: fakeUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error");
        return;
      }

      alert("Comprobante enviado correctamente");

      router.push("/my-bookings");
    } catch (error) {
      console.error(error);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white border rounded-3xl p-8 w-full max-w-md shadow-sm">

        <h1 className="text-2xl font-bold mb-2">
          Subir comprobante
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Sube una captura o PDF de tu pago
        </p>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar comprobante"}
        </button>
      </div>
    </div>
  );
}
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import BookingCard from "@/components/BookingCard";

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  // =========================
  // AUTH GUARD
  // =========================
  if (!session?.user?.id) {
    redirect("/login");
  }

  // =========================
  // BOOKINGS QUERY (OPTIMIZADO)
  // =========================
  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      status: {
        not: "CANCELLED",
      },
    },

    include: {
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Mis reservas
          </h1>

          <p className="text-gray-500 mt-2">
            Gestiona y revisa el estado de tus reservas
          </p>
        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}
        {bookings.length === 0 && (
          <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">
              No tienes reservas aún
            </h2>

            <p className="text-gray-500 mt-3">
              Cuando hagas una reserva aparecerá aquí automáticamente
            </p>
          </div>
        )}

        {/* =========================
            BOOKINGS LIST
        ========================= */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
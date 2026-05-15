import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import BookingCard from "@/components/BookingCard";

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  // PROTEGER RUTA
  if (!session?.user?.id) {
    redirect("/login");
  }

  // RESERVAS DEL USUARIO
  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,

      // NO MOSTRAR CANCELADAS
      status: {
        not: "CANCELLED",
      },
    },

    include: {
      property: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Mis reservas
          </h1>

          <p className="text-gray-500 mt-2">
            Gestiona todas tus reservas
          </p>
        </div>

        {/* EMPTY STATE */}
        {bookings.length === 0 && (
          <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">
              No tienes reservas
            </h2>
            <p className="text-gray-500 mt-3">
              Cuando reserves aparecerán aquí
            </p>
          </div>
        )}

        {/* LISTA DE RESERVAS */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>

      </div>
    </div>
  );
}
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

export default async function MyBookingsPage() {

  const session =
    await getServerSession(authOptions);

  // PROTEGER RUTA
  if (!session?.user?.id) {
    redirect("/login");
  }

  // RESERVAS DEL USUARIO
  const bookings =
    await prisma.booking.findMany({

      where: {
        userId: session.user.id,
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

          <h1 className="text-4xl font-bold">
            Mis reservas
          </h1>

          <p className="text-gray-500 mt-2">
            Gestiona todas tus reservas
          </p>

        </div>

        {/* EMPTY */}
        {bookings.length === 0 && (

          <div className="
            bg-white border rounded-3xl
            p-10 text-center
          ">

            <h2 className="text-2xl font-semibold">
              No tienes reservas
            </h2>

            <p className="text-gray-500 mt-3">
              Cuando reserves aparecerán aquí
            </p>

          </div>

        )}

        {/* LIST */}
        <div className="space-y-6">

          {bookings.map((booking) => {

            const nights =
              Math.ceil(
                (
                  new Date(
                    booking.endDate
                  ).getTime()
                  -
                  new Date(
                    booking.startDate
                  ).getTime()
                ) /
                (1000 * 60 * 60 * 24)
              );

            return (

              <div
                key={booking.id}
                className="
                  bg-white border rounded-3xl
                  p-6 shadow-sm
                "
              >

                <div className="
                  flex flex-col lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-6
                ">

                  {/* LEFT */}
                  <div className="space-y-4">

                    <div>

                      <h2 className="text-2xl font-semibold">
                        Hospedaje en San Miguel
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Reserva realizada el{" "}
                        {new Date(
                          booking.createdAt
                        ).toLocaleDateString("es-PE")}
                      </p>

                    </div>

                    <div className="
                      grid grid-cols-1 sm:grid-cols-3
                      gap-4 text-sm
                    ">

                      <div>

                        <p className="text-gray-500">
                          Check-in
                        </p>

                        <p className="font-medium mt-1">
                          {new Date(
                            booking.startDate
                          ).toLocaleDateString("es-PE")}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-500">
                          Check-out
                        </p>

                        <p className="font-medium mt-1">
                          {new Date(
                            booking.endDate
                          ).toLocaleDateString("es-PE")}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-500">
                          Noches
                        </p>

                        <p className="font-medium mt-1">
                          {nights}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}
                  <div className="
                    flex flex-col items-start
                    lg:items-end gap-4
                  ">

                    <div>

                      <p className="text-gray-500 text-sm">
                        Total
                      </p>

                      <h3 className="text-3xl font-bold mt-1">
                        S/ {booking.totalPrice}
                      </h3>

                    </div>

                    <span
                      className={`
                        inline-flex items-center
                        px-4 py-2 rounded-full
                        text-sm font-medium
                        ${
                          booking.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >

                      {booking.status === "APPROVED"
                        ? "Aprobada"
                        : booking.status === "REJECTED"
                        ? "Rechazada"
                        : "Pendiente"}

                    </span>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}
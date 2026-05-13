import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

import BookingActions from "./BookingActions";

export default async function AdminBookingsPage() {

  const session =
    await getServerSession(authOptions);

  // PROTEGER ADMIN
  if (
    !session ||
    session.user.role !== "ADMIN"
  ) {
    redirect("/");
  }

  // RESERVAS
  const bookings =
    await prisma.booking.findMany({

      include: {
        user: true,
        property: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-6
        md:p-10
      "
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Reservas
          </h1>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Gestión de reservas del hospedaje
          </p>

        </div>

        {/* EMPTY STATE */}

        {bookings.length === 0 && (

          <div
            className="
              rounded-3xl
              border
              bg-white
              p-10
              text-center
            "
          >

            <p
              className="
                text-gray-500
              "
            >
              No hay reservas registradas
            </p>

          </div>

        )}

        {/* TABLE */}

        {bookings.length > 0 && (

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              bg-white
              shadow-sm
            "
          >

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead
                  className="
                    border-b
                    bg-gray-100
                  "
                >

                  <tr
                    className="
                      text-left
                      text-sm
                      text-gray-600
                    "
                  >

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                      "
                    >
                      Usuario
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                      "
                    >
                      Propiedad
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                      "
                    >
                      Fechas
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                      "
                    >
                      Total
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                      "
                    >
                      Estado
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        font-semibold
                      "
                    >
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {bookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="
                        border-b
                        transition
                        hover:bg-gray-50
                      "
                    >

                      {/* USER */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <div>

                          <p className="font-medium">

                            {booking.user?.name ||
                              "Sin nombre"}

                          </p>

                          <p
                            className="
                              text-sm
                              text-gray-500
                            "
                          >

                            {booking.user?.email}

                          </p>

                        </div>

                      </td>

                      {/* PROPERTY */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <div>

                          <p className="font-medium">

                            {booking.property?.title ||
                              "Sin propiedad"}

                          </p>

                        </div>

                      </td>

                      {/* DATES */}

                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                        "
                      >

                        <div className="space-y-1">

                          <p>

                            Inicio:
                            {" "}
                            {new Date(
                              booking.startDate
                            ).toLocaleDateString(
                              "es-PE"
                            )}

                          </p>

                          <p>

                            Fin:
                            {" "}
                            {new Date(
                              booking.endDate
                            ).toLocaleDateString(
                              "es-PE"
                            )}

                          </p>

                        </div>

                      </td>

                      {/* PRICE */}

                      <td
                        className="
                          px-6
                          py-5
                          font-semibold
                        "
                      >

                        S/
                        {" "}
                        {booking.totalPrice}

                      </td>

                      {/* STATUS */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            ${
                              booking.status ===
                              "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : booking.status ===
                                  "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >

                          {booking.status}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <BookingActions
                          bookingId={booking.id}
                          currentStatus={
                            booking.status
                          }
                        />

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}
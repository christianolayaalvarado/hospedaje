import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import Link from "next/link";

import CancelBookingButton
  from "@/components/CancelBookingButton";

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

  function getStatusStyles(status: string) {

    switch (status) {

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "PAYMENT_SENT":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700";

      case "EXPIRED":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function getStatusText(status: string) {

    switch (status) {

      case "APPROVED":
        return "Aprobada";

      case "REJECTED":
        return "Rechazada";

      case "PAYMENT_SENT":
        return "Pago enviado";

      case "CANCELLED":
        return "Cancelada";

      case "EXPIRED":
        return "Expirada";

      default:
        return "Pendiente de pago";
    }
  }

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

        {/* EMPTY */}
        {bookings.length === 0 && (

          <div
            className="
              bg-white
              border
              rounded-3xl
              p-10
              text-center
              shadow-sm
            "
          >

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
                  bg-white
                  border
                  rounded-3xl
                  p-6
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >

                <div
                  className="
                    flex flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-8
                  "
                >

                  {/* LEFT */}
                  <div className="space-y-5 flex-1">

                    <div>

                      <h2 className="text-2xl font-semibold text-gray-900">

                        {booking.property?.title ||
                          "Hospedaje"}

                      </h2>

                      <p className="text-gray-500 mt-1">

                        Reserva realizada el{" "}

                        {new Date(
                          booking.createdAt
                        ).toLocaleDateString("es-PE")}

                      </p>

                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-4
                      "
                    >

                      {/* CHECK-IN */}
                      <div
                        className="
                          border
                          rounded-2xl
                          p-4
                          bg-gray-50
                        "
                      >

                        <p className="text-sm text-gray-500">
                          Check-in
                        </p>

                        <p className="font-semibold mt-2">

                          {new Date(
                            booking.startDate
                          ).toLocaleDateString("es-PE")}

                        </p>

                      </div>

                      {/* CHECK-OUT */}
                      <div
                        className="
                          border
                          rounded-2xl
                          p-4
                          bg-gray-50
                        "
                      >

                        <p className="text-sm text-gray-500">
                          Check-out
                        </p>

                        <p className="font-semibold mt-2">

                          {new Date(
                            booking.endDate
                          ).toLocaleDateString("es-PE")}

                        </p>

                      </div>

                      {/* NOCHES */}
                      <div
                        className="
                          border
                          rounded-2xl
                          p-4
                          bg-gray-50
                        "
                      >

                        <p className="text-sm text-gray-500">
                          Noches
                        </p>

                        <p className="font-semibold mt-2">
                          {nights}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}
                  <div
                    className="
                      flex
                      flex-col
                      items-start
                      lg:items-end
                      gap-5
                    "
                  >

                    {/* TOTAL */}
                    <div className="text-left lg:text-right">

                      <p className="text-sm text-gray-500">
                        Total reserva
                      </p>

                      <h3 className="text-4xl font-bold text-emerald-600 mt-1">

                        S/ {booking.totalPrice}

                      </h3>

                    </div>

                    {/* STATUS */}
                    <span
                      className={`
                        inline-flex
                        items-center
                        px-5
                        py-2.5
                        rounded-full
                        text-sm
                        font-medium
                        ${getStatusStyles(
                          booking.status
                        )}
                      `}
                    >

                      {getStatusText(
                        booking.status
                      )}

                    </span>

                    {/* ALERTA */}
                    {booking.status ===
                      "PENDING_PAYMENT" && (

                      <div
                        className="
                          rounded-2xl
                          border
                          border-yellow-200
                          bg-yellow-50
                          p-4
                          text-sm
                          text-yellow-700
                          max-w-sm
                        "
                      >

                        Debes subir tu comprobante
                        de pago antes de que expire
                        la reserva.

                      </div>

                    )}

                    {/* BOTONES */}
                    <div className="flex flex-wrap gap-3">

                      {/* SUBIR COMPROBANTE */}
                      {booking.status ===
                        "PENDING_PAYMENT" && (

                        <Link
                          href={`/my-bookings/${booking.id}/upload-proof`}
                          className="
                            bg-black
                            hover:bg-gray-800
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            text-sm
                            font-medium
                            transition
                          "
                        >
                          Subir comprobante
                        </Link>

                      )}

                      {/* CANCELAR */}
                      {(booking.status ===
                        "PENDING_PAYMENT" ||

                        booking.status ===
                        "PAYMENT_SENT") && (

                        <CancelBookingButton
                          bookingId={booking.id}
                        />

                      )}

                    </div>

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
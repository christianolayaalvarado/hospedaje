import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {

  const session =
    await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

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

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Mis reservas
          </h1>

          <p className="text-gray-500 mt-2">
            Gestiona tus reservas
          </p>

        </div>

        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="
                bg-white border rounded-3xl
                p-6 shadow-sm
              "
            >

              <div className="
                flex flex-col md:flex-row
                md:items-center
                md:justify-between
                gap-6
              ">

                <div>

                  <h2 className="text-xl font-semibold">
                    Hospedaje en San Miguel
                  </h2>

                  <p className="text-gray-500 mt-2">

                    {new Date(
                      booking.startDate
                    ).toLocaleDateString("es-PE")}

                    {" - "}

                    {new Date(
                      booking.endDate
                    ).toLocaleDateString("es-PE")}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold">
                    S/ {booking.totalPrice}
                  </p>

                  <div className="mt-3">

                    <span
                      className={`
                        inline-flex px-3 py-1 rounded-full
                        text-xs font-medium

                        ${
                          booking.status === "APPROVED"
                            ? "bg-green-100 text-green-700"

                            : booking.status === "REJECTED"
                            ? "bg-red-100 text-red-700"

                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {booking.status}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

          {bookings.length === 0 && (

            <div className="
              bg-white border rounded-3xl
              p-16 text-center
            ">

              <h2 className="text-2xl font-semibold">
                No tienes reservas
              </h2>

              <p className="text-gray-500 mt-3">
                Cuando hagas una reserva aparecerá aquí.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
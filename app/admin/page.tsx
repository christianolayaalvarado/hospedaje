import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {

  const session = await getServerSession(authOptions);
  
  
  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  // 🔥 STATS
  const [
    totalBookings,
    pendingBookings,
    approvedBookings,
    rejectedBookings,
    totalUsers,
    bookings,
  ] = await Promise.all([

    prisma.booking.count(),

    prisma.booking.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.booking.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "REJECTED",
      },
    }),

    prisma.user.count(),

    prisma.booking.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

  ]);

  // 🔥 INGRESOS
  const approvedReservations =
    await prisma.booking.findMany({
      where: {
        status: "APPROVED",
      },
    });

  const totalRevenue =
    approvedReservations.reduce(
      (acc, booking) =>
        acc + booking.totalPrice,
      0
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard Admin
          </h1>

          <p className="text-gray-500 mt-2">
            Gestión general del hospedaje
          </p>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

          {/* TOTAL */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500">
              Reservas
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {totalBookings}
            </h2>

          </div>

          {/* PENDING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500">
              Pendientes
            </p>

            <h2 className="text-4xl font-bold mt-3 text-yellow-600">
              {pendingBookings}
            </h2>

          </div>

          {/* APPROVED */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500">
              Aprobadas
            </p>

            <h2 className="text-4xl font-bold mt-3 text-green-600">
              {approvedBookings}
            </h2>

          </div>

          {/* REJECTED */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500">
              Rechazadas
            </p>

            <h2 className="text-4xl font-bold mt-3 text-red-600">
              {rejectedBookings}
            </h2>

          </div>

          {/* USERS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500">
              Usuarios
            </p>

            <h2 className="text-4xl font-bold mt-3 text-blue-600">
              {totalUsers}
            </h2>

          </div>

        </div>

        {/* REVENUE */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border mb-10">

          <p className="text-sm text-gray-500">
            Ingresos Totales
          </p>

          <h2 className="text-5xl font-bold mt-4 text-emerald-600">

            S/ {totalRevenue.toFixed(2)}

          </h2>

          <p className="text-gray-400 mt-3 text-sm">
            Basado en reservas aprobadas
          </p>

        </div>

        {/* ÚLTIMAS RESERVAS */}
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-semibold">
              Últimas reservas
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100 border-b">

                <tr className="text-left text-sm text-gray-600">

                  <th className="px-6 py-4 font-semibold">
                    Usuario
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Fechas
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Total
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Estado
                  </th>

                </tr>

              </thead>

              <tbody>

                {bookings.map((booking) => (

                  <tr
                    key={booking.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-medium text-gray-900">
                          {booking.user?.name || "Sin nombre"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.user?.email}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">

                      <div className="space-y-1">

                        <p>
                          {new Date(
                            booking.startDate
                          ).toLocaleDateString("es-PE")}
                        </p>

                        <p>
                          {new Date(
                            booking.endDate
                          ).toLocaleDateString("es-PE")}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5 font-semibold">

                      S/ {booking.totalPrice}

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
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

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {bookings.length === 0 && (

            <div className="p-10 text-center text-gray-500">

              No hay reservas todavía.

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

import AdminBookingActions from "@/components/admin/AdminBookingActions";
import { getStatusStyles, getStatusText } from "@/lib/bookingStatus";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/");

  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

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
        status: {
          in: [BookingStatus.PENDING_PAYMENT, BookingStatus.PAYMENT_REVIEW],
        },
      },
    }),

    prisma.booking.count({
      where: { status: BookingStatus.APPROVED },
    }),

    prisma.booking.count({
      where: { status: BookingStatus.REJECTED },
    }),

    prisma.user.count(),

    prisma.booking.findMany({
      include: { user: true, property: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const totalRevenue = await prisma.booking.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      status: BookingStatus.APPROVED,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-500">Gestión del sistema</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

          {[
            ["Reservas", totalBookings],
            ["Pendientes", pendingBookings],
            ["Aprobadas", approvedBookings],
            ["Rechazadas", rejectedBookings],
            ["Usuarios", totalUsers],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl p-6 border">
              <p className="text-gray-500 text-sm">{label}</p>
              <h2 className="text-3xl font-bold mt-2">{value}</h2>
            </div>
          ))}

        </div>

        {/* REVENUE */}
        <div className="bg-white rounded-2xl p-6 border mb-10">
          <p className="text-gray-500 text-sm">Ingresos</p>
          <h2 className="text-4xl font-bold text-green-600">
            S/ {totalRevenue._sum.totalPrice ?? 0}
          </h2>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Últimas reservas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-4 text-left">Usuario</th>
                  <th className="p-4 text-left">Propiedad</th>
                  <th className="p-4 text-left">Fechas</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Estado</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">

                    <td className="p-4">
                      <p className="font-medium">{b.user?.name}</p>
                      <p className="text-sm text-gray-500">{b.user?.email}</p>
                    </td>

                    <td className="p-4">{b.property?.title}</td>

                    <td className="p-4 text-sm">
                      {new Date(b.startDate).toLocaleDateString("es-PE")} -{" "}
                      {new Date(b.endDate).toLocaleDateString("es-PE")}
                    </td>

                    <td className="p-4 font-semibold">S/ {b.totalPrice}</td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusStyles(b.status)}`}>
                        {getStatusText(b.status)}
                      </span>

                      <div className="mt-2">
                        <AdminBookingActions
                          bookingId={b.id}
                          status={b.status}
                        />
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
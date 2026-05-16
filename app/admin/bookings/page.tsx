import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import BookingActions from "./BookingActions";
import { getStatusStyles, getStatusText } from "@/lib/bookingStatus";

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    include: { user: true, property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Reservas</h1>

        <div className="bg-white rounded-2xl border overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Usuario</th>
                <th className="p-4 text-left">Propiedad</th>
                <th className="p-4 text-left">Fechas</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">

                  <td className="p-4">
                    {b.user?.name}
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
                  </td>

                  <td className="p-4">
                    <BookingActions
                      bookingId={b.id}
                      currentStatus={b.status}
                    />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}
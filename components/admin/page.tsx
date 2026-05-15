import StatsCard from "@/components/admin/StatsCard";

import { prisma } from "@/lib/prisma";

export default async function AdminPage() {

  const [
    usersCount,
    bookingsCount,
    pendingBookings,
    propertiesCount,
  ] = await Promise.all([

    prisma.user.count(),

    prisma.booking.count(),

    prisma.booking.count({
      where: {
        status: {
          in: [
            "PENDING_PAYMENT",
            "PAYMENT_REVIEW",
          ],
        },
      },
    }),

    prisma.property.count(),

  ]);

  return (

    <div>

      <div className="mb-8">

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Dashboard
        </h1>

        <p className="text-gray-500">
          Panel administrativo
        </p>

      </div>

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >

        <StatsCard
          title="Usuarios"
          value={usersCount}
        />

        <StatsCard
          title="Reservas"
          value={bookingsCount}
        />

        <StatsCard
          title="Pendientes"
          value={pendingBookings}
        />

        <StatsCard
          title="Propiedades"
          value={propertiesCount}
        />

      </div>

    </div>

  );

}
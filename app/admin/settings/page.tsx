import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const discountCodes = await prisma.discountCode.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const seasons = await prisma.seasonalPrice.findMany({
    include: {
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">
          Configuración del Booking Engine
        </h1>

        <p className="text-gray-500 mt-2">
          Gestiona descuentos, temporadas y reglas.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Códigos de descuento
        </h2>

        <div className="grid gap-4">
          {discountCodes.map((code) => (
            <div
              key={code.id}
              className="border rounded-2xl p-5 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">
                    {code.code}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {code.type === "PERCENTAGE"
                      ? `${code.value}%`
                      : `S/ ${code.value}`}
                  </div>
                </div>

                <div
                  className={`text-sm font-medium ${
                    code.active
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {code.active ? "Activo" : "Inactivo"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Temporadas
        </h2>

        <div className="grid gap-4">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="border rounded-2xl p-5 bg-white"
            >
              <div className="font-semibold">
                {season.title}
              </div>

              <div className="text-sm text-gray-500 mt-1">
                {season.property.title}
              </div>

              <div className="mt-2 font-medium">
                S/ {season.price}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

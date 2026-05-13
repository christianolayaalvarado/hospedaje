import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import Link from "next/link";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

export default async function AdminPropertiesPage() {

  const session =
    await getServerSession(authOptions);

  // PROTEGER ADMIN
  if (
    !session ||
    session.user.role !== "ADMIN"
  ) {
    redirect("/");
  }

  // PROPERTIES
  const properties =
    await prisma.property.findMany({

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

        <div
          className="
            mb-8
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-bold
              "
            >
              Propiedades
            </h1>

            <p
              className="
                mt-2
                text-gray-500
              "
            >
              Gestión de hospedajes
            </p>

          </div>

          <Link
            href="/admin/properties/new"
            className="
              rounded-xl
              bg-black
              px-5
              py-3
              text-white
            "
          >
            Nueva propiedad
          </Link>

        </div>

        {/* EMPTY */}

        {properties.length === 0 && (

          <div
            className="
              rounded-3xl
              border
              bg-white
              p-10
              text-center
            "
          >

            <p className="text-gray-500">
              No hay propiedades registradas
            </p>

          </div>

        )}

        {/* TABLE */}

        {properties.length > 0 && (

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

              <table
                className="
                  w-full
                  min-w-[900px]
                "
              >

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

                    <th className="px-6 py-4">
                      Título
                    </th>

                    <th className="px-6 py-4">
                      Slug
                    </th>

                    <th className="px-6 py-4">
                      Precio Base
                    </th>

                    <th className="px-6 py-4">
                      Creado
                    </th>

                    <th className="px-6 py-4">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {properties.map(
                    (property) => (

                      <tr
                        key={property.id}
                        className="
                          border-b
                          hover:bg-gray-50
                        "
                      >

                        {/* TITLE */}

                        <td className="px-6 py-5">

                          <p className="font-medium">
                            {property.title}
                          </p>

                        </td>

                        {/* SLUG */}

                        <td className="px-6 py-5">

                          {property.slug}

                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5">

                          S/ {property.basePrice}

                        </td>

                        {/* CREATED */}

                        <td className="px-6 py-5">

                          {new Date(
                            property.createdAt
                          ).toLocaleDateString(
                            "es-PE"
                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex gap-3">

                            <Link
                              href={`/admin/properties/${property.id}`}
                              className="
                                rounded-lg
                                bg-gray-200
                                px-4
                                py-2
                                text-sm
                              "
                            >
                              Editar
                            </Link>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    include: {
      bookings: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900">
            Usuarios
          </h1>

          <p className="text-gray-500 mt-2">
            Gestiona los usuarios registrados
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100 border-b">

                <tr className="text-left text-sm text-gray-600">

                  <th className="px-6 py-4 font-semibold">
                    Usuario
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Rol
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Reservas
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Registro
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-medium text-gray-900">
                          {user.name || "Sin nombre"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${
                            user.role === "ADMIN"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {user.role}
                      </span>

                    </td>

                    <td className="px-6 py-5 font-medium">

                      {user.bookings.length}

                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500">

                      {new Date(
                        user.createdAt
                      ).toLocaleDateString("es-PE")}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {users.length === 0 && (

            <div className="p-10 text-center text-gray-500">

              No hay usuarios registrados.

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
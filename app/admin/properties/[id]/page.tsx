import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

import EditPropertyForm from "./EditPropertyForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage(
  props: Props
) {

  const session =
    await getServerSession(authOptions);

  // ADMIN ONLY
  if (
    !session ||
    session.user.role !== "ADMIN"
  ) {
    redirect("/");
  }

  const { id } =
    await props.params;

  // PROPERTY
  const property =
    await prisma.property.findUnique({

      where: {
        id,
      },

    });

  if (!property) {
    redirect("/admin/properties");
  }

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-6
        md:p-10
      "
    >

      <div className="max-w-3xl mx-auto">

        <div className="mb-8">

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Editar propiedad
          </h1>

          <p
            className="
              mt-2
              text-gray-500
            "
          >
            Actualiza la información
          </p>

        </div>

        <EditPropertyForm
          property={property}
        />

      </div>

    </div>

  );

}
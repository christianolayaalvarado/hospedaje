import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

//
// PATCH
//

export async function PATCH(
  req: NextRequest,
  context: Context
) {

  try {

    // SESSION
    const session =
      await getServerSession(
        authOptions
      );

    // ADMIN ONLY
    if (
      !session ||
      session.user.role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );

    }

    // PARAMS
    const { id } =
      await context.params;

    // BODY
    const body =
      await req.json();

    const {
      title,
      slug,
      description,
      basePrice,
    } = body;

    // VALIDATION
    if (
      !title ||
      !slug ||
      !description ||
      !basePrice
    ) {

      return NextResponse.json(
        {
          error:
            "Todos los campos son obligatorios",
        },
        {
          status: 400,
        }
      );

    }

    // CHECK SLUG
    const existingSlug =
      await prisma.property.findFirst({

        where: {

          slug,

          NOT: {
            id,
          },

        },

      });

    if (existingSlug) {

      return NextResponse.json(
        {
          error:
            "El slug ya existe",
        },
        {
          status: 409,
        }
      );

    }

    // UPDATE
    const property =
      await prisma.property.update({

        where: {
          id,
        },

        data: {

          title,

          slug,

          description,

          basePrice,

        },

      });

    return NextResponse.json(
      property
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando propiedad",
      },
      {
        status: 500,
      }
    );

  }

}

//
// DELETE
//

export async function DELETE(
  req: NextRequest,
  context: Context
) {

  try {

    // SESSION
    const session =
      await getServerSession(
        authOptions
      );

    // ADMIN ONLY
    if (
      !session ||
      session.user.role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );

    }

    // PARAMS
    const { id } =
      await context.params;

    // DELETE
    await prisma.property.delete({

      where: {
        id,
      },

    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error eliminando propiedad",
      },
      {
        status: 500,
      }
    );

  }

}
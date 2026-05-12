import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    // SESSION
    const session =
      await getServerSession(authOptions);

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

    const { status } = body;

    // VALIDACIÓN
    if (
      !["APPROVED", "REJECTED"].includes(
        status
      )
    ) {

      return NextResponse.json(
        {
          error: "Estado inválido",
        },
        {
          status: 400,
        }
      );
    }

    // UPDATE
    const booking =
      await prisma.booking.update({
        where: {
          id,
        },

        data: {
          status,
        },
      });

    return NextResponse.json(
      booking
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando reserva",
      },
      {
        status: 500,
      }
    );
  }
}
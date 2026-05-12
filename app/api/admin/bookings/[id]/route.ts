import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
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

    const { id } =
      await context.params;

    const body =
      await req.json();

    const { status } = body;

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
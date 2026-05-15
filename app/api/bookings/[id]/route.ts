import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ========================================================
// CANCEL BOOKING
// ========================================================

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {

      return NextResponse.json(
        {
          success: false,
          error: "No autorizado",
        },
        { status: 401 }
      );

    }

    const { id } =
      await context.params;

    // BOOKING
    const booking =
      await prisma.booking.findUnique({

        where: {
          id,
        },

      });

    if (!booking) {

      return NextResponse.json(
        {
          success: false,
          error: "Reserva no encontrada",
        },
        { status: 404 }
      );

    }

    // VALIDAR OWNER
    if (
      booking.userId !==
      session.user.id
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "No permitido",
        },
        { status: 403 }
      );

    }

    // SOLO CANCELABLES
    const allowedStatuses = [

      "PENDING_PAYMENT",
      "PAYMENT_SENT",

    ];

    if (
      !allowedStatuses.includes(
        booking.status
      )
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Esta reserva no puede cancelarse",
        },
        { status: 400 }
      );

    }

    // UPDATE STATUS
    await prisma.booking.update({

      where: {
        id,
      },

      data: {
        status: "CANCELLED",
      },

    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "DELETE BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Error cancelando reserva",
      },
      { status: 500 }
    );

  }

}
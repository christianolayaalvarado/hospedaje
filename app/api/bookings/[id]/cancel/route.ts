import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// =========================================================
// CANCEL BOOKING
// =========================================================

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    // =====================================================
    // SESSION
    // =====================================================

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

    // =====================================================
    // PARAMS
    // =====================================================

    const { id } =
      await context.params;

    if (!id) {

      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // BOOKING
    // =====================================================

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

    // =====================================================
    // VALIDAR PROPIETARIO O ADMIN
    // =====================================================

    const isOwner =
      booking.userId ===
      session.user.id;

    const isAdmin =
      session.user.role === "ADMIN" ||
      session.user.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {

      return NextResponse.json(
        {
          success: false,
          error: "Sin permisos",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // VALIDAR STATUS
    // =====================================================

    if (
      booking.status === "APPROVED"
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "No puedes cancelar una reserva aprobada",
        },
        { status: 400 }
      );
    }

    if (
      booking.status === "CANCELLED"
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "La reserva ya fue cancelada",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CANCELAR
    // =====================================================

    await prisma.booking.update({
      where: {
        id,
      },

      data: {
        status: "CANCELLED",
      },
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "POST /bookings/[id]/cancel error:",
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
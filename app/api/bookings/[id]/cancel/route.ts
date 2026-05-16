import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingStatus } from "@prisma/client";

// =========================================================
// CANCEL BOOKING (SECURE)
// =========================================================
export async function PATCH(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // =========================
    // AUTH CHECK
    // =========================
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // GET PARAMS
    // =========================
    const { id: bookingId } = await context.params;

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // FIND BOOKING
    // =========================
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Reserva no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // OWNERSHIP CHECK
    // =========================
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No tienes permiso para cancelar esta reserva",
        },
        {
          status: 403,
        }
      );
    }

    // =========================
    // VALID STATUS RULES
    // =========================
    const blockedStatuses: BookingStatus[] = [
      BookingStatus.CANCELLED,
      BookingStatus.EXPIRED,
      BookingStatus.APPROVED,
    ];

    if (
      blockedStatuses.includes(
        booking.status as BookingStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Esta reserva no puede cancelarse",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // UPDATE BOOKING
    // =========================
    const updated = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      booking: updated,
    });
  } catch (error) {
    console.error(
      "CANCEL BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Error interno al cancelar reserva",
      },
      {
        status: 500,
      }
    );
  }
}
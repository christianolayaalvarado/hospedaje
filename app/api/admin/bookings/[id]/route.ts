import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingStatus } from "@prisma/client";

// =========================================================
// PATCH: APROBAR / RECHAZAR BOOKING
// =========================================================

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // =====================================================
    // VALIDACIÓN ADMIN (BACKEND FIX)
    // =====================================================
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" &&
        session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body as {
      action: "APPROVE" | "REJECT";
    };

    // =====================================================
    // VALIDACIÓN INPUT
    // =====================================================
    if (!action) {
      return NextResponse.json(
        { success: false, error: "Acción requerida" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking no encontrado" },
        { status: 404 }
      );
    }

    // =====================================================
    // ACTUALIZAR ESTADO
    // =====================================================
    let updated;

    if (action === "APPROVE") {
      updated = await prisma.booking.update({
        where: { id: params.id },
        data: {
          status: BookingStatus.APPROVED,
          approvedAt: new Date(),
        },
      });
    }

    if (action === "REJECT") {
      updated = await prisma.booking.update({
        where: { id: params.id },
        data: {
          status: BookingStatus.REJECTED,
        },
      });
    }

    return NextResponse.json({
      success: true,
      booking: updated,
    });
  } catch (error) {
    console.error("ADMIN BOOKING ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
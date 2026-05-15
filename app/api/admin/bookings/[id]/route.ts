import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // =====================================================
    // VALIDACIÓN ADMIN
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

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Acción requerida" },
        { status: 400 }
      );
    }

    // 🔥 FIX REAL NEXT.JS 14+
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking no encontrado" },
        { status: 404 }
      );
    }

    let updated;

    if (action === "APPROVE") {
      updated = await prisma.booking.update({
        where: { id },
        data: {
          status: BookingStatus.APPROVED,
          approvedAt: new Date(),
        },
      });
    }

    if (action === "REJECT") {
      updated = await prisma.booking.update({
        where: { id },
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
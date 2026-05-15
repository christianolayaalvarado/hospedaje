import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // =====================================================
    // VALIDACIÓN AUTH (BACKEND FIX)
    // =====================================================
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { bookingId, paymentProof } = body as {
      bookingId: string;
      paymentProof: string;
    };

    // =====================================================
    // VALIDACIÓN INPUT
    // =====================================================
    if (!bookingId || !paymentProof) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // =====================================================
    // BUSCAR BOOKING
    // =====================================================
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    // =====================================================
    // VALIDACIÓN SEGURIDAD (USER OWNERSHIP)
    // =====================================================
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "No permitido" },
        { status: 403 }
      );
    }

    // =====================================================
    // VALIDACIÓN ESTADO
    // =====================================================
    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      return NextResponse.json(
        {
          success: false,
          error: "Esta reserva no permite comprobante",
        },
        { status: 409 }
      );
    }

    // =====================================================
    // ACTUALIZAR BOOKING
    // =====================================================
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentProof,
        status: BookingStatus.PAYMENT_REVIEW,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updated,
    });
  } catch (error) {
    console.error("UPLOAD PROOF ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
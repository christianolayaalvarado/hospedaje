import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export async function GET() {
  try {
    const now = new Date();

    // Buscar reservas vencidas
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.PAYMENT_REVIEW,
          ],
        },
        expiresAt: {
          lt: now,
        },
      },
    });

    if (expiredBookings.length === 0) {
      return NextResponse.json({
        message: "No expired bookings",
        expired: 0,
      });
    }

    // Actualizar a EXPIRED
    await prisma.booking.updateMany({
      where: {
        id: {
          in: expiredBookings.map((b) => b.id),
        },
      },
      data: {
        status: BookingStatus.EXPIRED,
        cancelledAt: now,
      },
    });

    return NextResponse.json({
      message: "Bookings expired successfully",
      expired: expiredBookings.length,
    });
  } catch (error) {
    console.error("CRON ERROR:", error);

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
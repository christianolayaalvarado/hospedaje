import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

// =========================================================
// CRON: EXPIRE BOOKINGS
// =========================================================
export async function GET() {
  try {
    const now = new Date();

    // 🚀 UNA SOLA OPERACIÓN (más eficiente)
    const result = await prisma.booking.updateMany({
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
      data: {
        status: BookingStatus.EXPIRED,
        cancelledAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      expired: result.count,
      time: now,
    });

  } catch (error) {
    console.error("CRON ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingStatus } from "@prisma/client";

// =========================================================
// GET BOOKINGS (CALENDARIO + BLOQUEOS)
// =========================================================
export async function GET() {
  try {
    // Expirar reservas automáticamente
    await prisma.booking.updateMany({
      where: {
        status: BookingStatus.PENDING_PAYMENT,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: BookingStatus.EXPIRED,
      },
    });

    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.PAYMENT_REVIEW,
            BookingStatus.APPROVED,
          ],
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        propertyId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error fetching bookings",
      },
      { status: 500 }
    );
  }
}

// =========================================================
// CREATE BOOKING (VALIDACIÓN + SOLAPAMIENTO)
// =========================================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Debes iniciar sesión" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      startDate,
      endDate,
      totalPrice,
      propertyId,
    } = body as {
      startDate?: string | Date;
      endDate?: string | Date;
      totalPrice?: number;
      propertyId?: string;
    };

    // =====================================================
    // VALIDACIÓN MEJORADA (IMPORTANTE)
    // =====================================================
    if (
      !startDate ||
      !endDate ||
      !propertyId ||
      totalPrice === undefined ||
      totalPrice === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos incompletos",
        },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Fechas inválidas",
        },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        {
          success: false,
          error: "Rango de fechas inválido",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VALIDAR PROPERTY
    // =====================================================
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: "Propiedad no existe",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // EXPIRAR RESERVAS VIEJAS
    // =====================================================
    await prisma.booking.updateMany({
      where: {
        status: BookingStatus.PENDING_PAYMENT,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: BookingStatus.EXPIRED,
      },
    });

    // =====================================================
    // VALIDAR SOLAPAMIENTO
    // =====================================================
    const overlap = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.PAYMENT_REVIEW,
            BookingStatus.APPROVED,
          ],
        },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });

    if (overlap) {
      return NextResponse.json(
        {
          success: false,
          error: "Estas fechas ya están reservadas",
        },
        { status: 409 }
      );
    }

    // =====================================================
    // CREAR BOOKING
    // =====================================================
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    const booking = await prisma.booking.create({
      data: {
        startDate: start,
        endDate: end,
        totalPrice: Number(totalPrice),
        status: BookingStatus.PENDING_PAYMENT,
        expiresAt,
        userId: session.user.id,
        propertyId,
      },
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("POST /bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error creando booking",
      },
      { status: 500 }
    );
  }
}
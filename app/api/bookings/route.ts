import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingStatus } from "@prisma/client";

import {
  calculateBookingPrice,
  validateDiscountCode,
} from "@/lib/pricing";

async function expireBookings() {
  await prisma.booking.updateMany({
    where: {
      status: BookingStatus.PENDING_PAYMENT,
      expiresAt: {
        lt: new Date(),
      },
    },
    data: {
      status: BookingStatus.EXPIRED,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    await expireBookings();

    const propertyId = req.nextUrl.searchParams.get("propertyId");

    const bookings = await prisma.booking.findMany({
      where: {
        ...(propertyId ? { propertyId } : {}),
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
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error fetching bookings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Debes iniciar sesión",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const {
      startDate,
      endDate,
      propertyId,
      discountCode,
    } = body;

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos incompletos",
        },
        {
          status: 400,
        }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json(
        {
          success: false,
          error: "Fechas inválidas",
        },
        {
          status: 400,
        }
      );
    }

    await expireBookings();

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
          {
            startDate: {
              lt: end,
            },
          },
          {
            endDate: {
              gt: start,
            },
          },
        ],
      },
    });

    if (overlap) {
      return NextResponse.json(
        {
          success: false,
          error: "Fechas ya reservadas",
        },
        {
          status: 409,
        }
      );
    }

    const pricing = await calculateBookingPrice({
      startDate: start,
      endDate: end,
      propertyId,
    });

    let total = pricing.total;
    let discountValue = 0;
    let discountCodeId: string | undefined;

    if (discountCode) {
      const validation = await validateDiscountCode({
        code: discountCode,
        subtotal: pricing.subtotal,
      });

      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error,
          },
          {
            status: 400,
          }
        );
      }

      discountValue = validation.discountValue;
      discountCodeId = validation.discount?.id;

      total -= discountValue;

      await prisma.discountCode.update({
        where: {
          id: validation.discount!.id,
        },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    total = Math.max(0, total);

    const ONE_HOUR = 1000 * 60 * 60;

    const expiresAt = new Date(
      Date.now() + ONE_HOUR
    );

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        userId: session.user.id,
        startDate: start,
        endDate: end,
        subtotalPrice: pricing.subtotal,
        totalPrice: total,
        discountValue,
        discountCodeId,
        expiresAt,
        status: BookingStatus.PENDING_PAYMENT,
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      pricing: {
        subtotal: pricing.subtotal,
        cleaningFee: pricing.cleaningFee,
        serviceFee: pricing.serviceFee,
        discountValue,
        total,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error creando booking",
      },
      {
        status: 500,
      }
    );
  }
}

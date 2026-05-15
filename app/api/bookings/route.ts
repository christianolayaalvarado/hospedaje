import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// =========================================================
// GET BOOKINGS
// =========================================================

export async function GET() {

  try {

    // =====================================================
    // LIBERAR RESERVAS EXPIRADAS
    // =====================================================

    await prisma.booking.updateMany({

      where: {

        status: "PENDING_PAYMENT",

        expiresAt: {
          lt: new Date(),
        },

      },

      data: {
        status: "EXPIRED",
      },

    });

    // =====================================================
    // BOOKINGS QUE BLOQUEAN FECHAS
    // =====================================================

    const bookings =
      await prisma.booking.findMany({

        where: {

          status: {

            in: [
              "PENDING_PAYMENT",
              "PAYMENT_REVIEW",
              "APPROVED",
            ],

          },

        },

        select: {
          id: true,
          startDate: true,
          endDate: true,
          status: true,
        },

        orderBy: {
          createdAt: "desc",
        },

      });

    return NextResponse.json(bookings);

  } catch (error) {

    console.error(
      "GET /bookings error:",
      error
    );

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
// CREATE BOOKING
// =========================================================

export async function POST(
  req: Request
) {

  try {

    // =====================================================
    // VALIDAR SESIÓN
    // =====================================================

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Debes iniciar sesión",
        },

        { status: 401 }

      );

    }

    const body =
      await req.json();

    const {
      startDate,
      endDate,
      totalPrice,
    } = body as {

      startDate:
        string | Date;

      endDate:
        string | Date;

      totalPrice:
        number;

    };

    // =====================================================
    // VALIDACIÓN
    // =====================================================

    if (
      !startDate ||
      !endDate ||
      !totalPrice
    ) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Datos incompletos",
        },

        { status: 400 }

      );

    }

    const start =
      new Date(startDate);

    const end =
      new Date(endDate);

    if (

      isNaN(start.getTime()) ||

      isNaN(end.getTime())

    ) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Fechas inválidas",
        },

        { status: 400 }

      );

    }

    if (start >= end) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Fecha inválida",
        },

        { status: 400 }

      );

    }

    // =====================================================
    // LIBERAR RESERVAS EXPIRADAS
    // =====================================================

    await prisma.booking.updateMany({

      where: {

        status: "PENDING_PAYMENT",

        expiresAt: {
          lt: new Date(),
        },

      },

      data: {
        status: "EXPIRED",
      },

    });

    // =====================================================
    // VALIDAR SOLAPAMIENTO
    // =====================================================

    const overlap =
      await prisma.booking.findFirst({

        where: {

          status: {

            in: [

              "PENDING_PAYMENT",

              "PAYMENT_REVIEW",

              "APPROVED",

            ],

          },

          NOT: {

            OR: [

              {
                endDate: {
                  lte: start,
                },
              },

              {
                startDate: {
                  gte: end,
                },
              },

            ],

          },

        },

      });

    if (overlap) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Estas fechas ya están reservadas",
        },

        { status: 409 }

      );

    }

    // =====================================================
    // PROPERTY
    // =====================================================

    const property =
      await prisma.property.findFirst();

    if (!property) {

      return NextResponse.json(

        {
          success: false,
          error:
            "No existe propiedad",
        },

        { status: 404 }

      );

    }

    // =====================================================
    // EXPIRACIÓN 30 MIN
    // =====================================================

    const expiresAt =
      new Date(

        Date.now() +
        1000 * 60 * 30

      );

    // =====================================================
    // CREAR BOOKING
    // =====================================================

    const booking =
      await prisma.booking.create({

        data: {

          startDate: start,

          endDate: end,

          totalPrice:
            Number(totalPrice),

          status:
            "PENDING_PAYMENT",

          expiresAt,

          userId:
            session.user.id,

          propertyId:
            property.id,

        },

      });

    return NextResponse.json({

      success: true,

      booking,

    });

  } catch (error) {

    console.error(
      "POST /bookings error:",
      error
    );

    return NextResponse.json(

      {
        success: false,
        error:
          "Error creando booking",
      },

      { status: 500 }

    );

  }

}
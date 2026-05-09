import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {

  try {

    const bookings =
      await prisma.booking.findMany({
        where: {
          status: "APPROVED",
        },
      });

    return NextResponse.json(bookings);

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: "Error fetching bookings",
      },
      { status: 500 }
    );

  }
}
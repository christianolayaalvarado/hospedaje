import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(
  req: Request,
  { params }: Params
) {

  try {

    const session = await getServerSession(authOptions);

    // 🔒 SOLO ADMIN
    if (!session || session.user.role !== "ADMIN") {

      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );

    }

    const body = await req.json();

    const { status } = body;

    // VALIDACIÓN
    if (
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {

      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );

    }

    // ACTUALIZAR BOOKING
    const booking = await prisma.booking.update({

      where: {
        id: params.id,
      },

      data: {
        status,
      },

    });

    return NextResponse.json(booking);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );

  }

}
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest
) {

  try {

    // SESSION
    const session =
      await getServerSession(
        authOptions
      );

    // ADMIN ONLY
    if (
      !session ||
      session.user.role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );

    }

    // BODY
    const body =
      await req.json();

    const {
      title,
      slug,
      description,
      basePrice,
    } = body;

    // VALIDATIONS
    if (
      !title ||
      !slug ||
      !description ||
      !basePrice
    ) {

      return NextResponse.json(
        {
          error:
            "Todos los campos son obligatorios",
        },
        {
          status: 400,
        }
      );

    }

    // SLUG EXISTS
    const existingProperty =
      await prisma.property.findUnique({

        where: {
          slug,
        },

      });

    if (existingProperty) {

      return NextResponse.json(
        {
          error:
            "El slug ya existe",
        },
        {
          status: 409,
        }
      );

    }

    // CREATE PROPERTY
    const property =
      await prisma.property.create({

        data: {

          title,

          slug,

          description,

          basePrice,

        },

      });

    return NextResponse.json(
      property
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error creando propiedad",
      },
      {
        status: 500,
      }
    );

  }

}
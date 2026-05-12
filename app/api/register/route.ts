import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      name,
      email,
      password,
    } = body;

    // VALIDACIONES
    if (!name || !email || !password) {

      return NextResponse.json(
        {
          error: "Todos los campos son obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    // EMAIL EXISTE
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {

      return NextResponse.json(
        {
          error: "El email ya está registrado",
        },
        {
          status: 409,
        }
      );
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREAR USUARIO
    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

    return NextResponse.json(user);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // =========================================================
  // 👤 USER DEMO
  // =========================================================

  const user =
    await prisma.user.create({
      data: {
        name: "Christian",
        email: "demo@stayflow.com",
      },
    });

  // =========================================================
  // 🏠 PROPERTY
  // =========================================================

  const property =
    await prisma.property.create({
      data: {
        title: "Departamento Premium San Miguel",

        slug:
          "departamento-premium-san-miguel",

        description:
          "Hospedaje premium frente al mar",

        basePrice: 180,
      },
    });

  // =========================================================
  // 📅 BOOKING
  // =========================================================

  const booking =
    await prisma.booking.create({
      data: {

        propertyId: property.id,
        userId: user.id,

        startDate:
          new Date("2026-05-15"),

        endDate:
          new Date("2026-05-20"),

        totalPrice: 900,

        status: "APPROVED",
      },
    });

  console.log({
    user,
    property,
    booking,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
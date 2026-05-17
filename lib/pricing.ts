import { prisma } from "@/lib/prisma";

export async function getPrecioPorDia(
  date: Date,
  propertyId?: string
): Promise<number> {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  let basePrice = 120;

  if (propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        basePrice: true,
      },
    });

    if (property) {
      basePrice = property.basePrice;
    }

    const season = await prisma.seasonalPrice.findFirst({
      where: {
        propertyId,
        active: true,
        startDate: {
          lte: normalized,
        },
        endDate: {
          gte: normalized,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (season) {
      return season.price;
    }
  }

  const day = normalized.getDay();
  const month = normalized.getMonth();

  if (day === 5 || day === 6) {
    basePrice += 40;
  }

  if ([0, 6, 11].includes(month)) {
    basePrice += 60;
  }

  const dayOfMonth = normalized.getDate();

  if (month === 11 && dayOfMonth >= 24) {
    basePrice += 80;
  }

  return basePrice;
}

export async function calculateBookingPrice({
  startDate,
  endDate,
  propertyId,
}: {
  startDate: Date;
  endDate: Date;
  propertyId: string;
}) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      cleaningFee: true,
      serviceFee: true,
    },
  });

  let subtotal = 0;

  const current = new Date(startDate);

  while (current < endDate) {
    subtotal += await getPrecioPorDia(current, propertyId);

    current.setDate(current.getDate() + 1);
  }

  const cleaningFee = property?.cleaningFee ?? 50;
  const serviceFee = property?.serviceFee ?? 30;

  return {
    subtotal,
    cleaningFee,
    serviceFee,
    total: subtotal + cleaningFee + serviceFee,
  };
}

export async function validateDiscountCode({
  code,
  subtotal,
}: {
  code: string;
  subtotal: number;
}) {
  const discount = await prisma.discountCode.findUnique({
    where: {
      code: code.toUpperCase(),
    },
  });

  if (!discount) {
    return {
      valid: false,
      error: "Código inválido",
    };
  }

  if (!discount.active) {
    return {
      valid: false,
      error: "Código desactivado",
    };
  }

  if (
    discount.expiresAt &&
    new Date(discount.expiresAt) < new Date()
  ) {
    return {
      valid: false,
      error: "Código expirado",
    };
  }

  if (
    discount.maxUses !== null &&
    discount.usedCount >= discount.maxUses
  ) {
    return {
      valid: false,
      error: "Código agotado",
    };
  }

  let discountValue = 0;

  if (discount.type === "PERCENTAGE") {
    discountValue = subtotal * (discount.value / 100);
  } else {
    discountValue = discount.value;
  }

  return {
    valid: true,
    discount,
    discountValue,
  };
}

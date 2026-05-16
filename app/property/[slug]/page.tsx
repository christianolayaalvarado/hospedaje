import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import PropertyClientPage from "@/components/PropertyClientPage";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: {
      slug,
    },
  });

  if (!property) {
    notFound();
  }

  return <PropertyClientPage property={property} />;
}
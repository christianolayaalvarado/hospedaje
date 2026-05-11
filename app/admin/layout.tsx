import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  // NO LOGUEADO
  if (!session?.user?.email) {
    redirect("/");
  }

  // BUSCAR USUARIO
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  // NO ES ADMIN
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN")
  ) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  CreditCard,
  Settings,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/admin/bookings",
    label: "Reservas",
    icon: BookOpen,
  },

  {
    href: "/admin/users",
    label: "Usuarios",
    icon: Users,
  },

  {
    href: "/admin/properties",
    label: "Propiedades",
    icon: Building2,
  },

  {
    href: "/admin/payments",
    label: "Pagos",
    icon: CreditCard,
  },

  {
    href: "/admin/settings",
    label: "Configuración",
    icon: Settings,
  },
];

export default function AdminSidebar() {

  const pathname = usePathname();

  return (

    <aside
      className="
        w-64
        min-h-screen
        border-r
        bg-white
        p-4
      "
    >

      <div className="mb-8">

        <h2
          className="
            text-2xl
            font-bold
          "
        >
          ADMIN
        </h2>

      </div>

      <nav className="space-y-2">

        {links.map((link) => {

          const Icon = link.icon;

          const active =
            pathname === link.href;

          return (

            <Link
              key={link.href}
              href={link.href}
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition
                ${
                  active
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }
              `}
            >

              <Icon size={20} />

              <span>
                {link.label}
              </span>

            </Link>

          );

        })}

      </nav>

    </aside>

  );

}
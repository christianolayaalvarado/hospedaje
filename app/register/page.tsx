"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { toast } from "sonner";

import { signIn } from "next-auth/react";

export default function RegisterPage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await fetch("/api/register", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),

        });

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(data.error);

        return;
      }

      toast.success(
        "Cuenta creada correctamente"
      );

      // LOGIN AUTOMÁTICO
      const login =
        await signIn("credentials", {

          email,
          password,

          redirect: false,

        });

      if (login?.error) {

        toast.error(
          "Cuenta creada, pero no se pudo iniciar sesión"
        );

        router.push("/login");

        return;
      }

      router.push("/");

      router.refresh();

    } catch (error) {

      console.error(error);

      toast.error(
        "Ocurrió un error"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            Crear cuenta
          </h1>

          <p className="text-gray-500 mt-2">
            Regístrate para reservar
          </p>

        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* NAME */}
          <div>

            <label className="text-sm font-medium">
              Nombre
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                w-full mt-2 border rounded-xl px-4 py-3
                focus:outline-none focus:ring-2
                focus:ring-black
              "
              placeholder="Tu nombre"
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full mt-2 border rounded-xl px-4 py-3
                focus:outline-none focus:ring-2
                focus:ring-black
              "
              placeholder="correo@email.com"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-sm font-medium">
              Contraseña
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full mt-2 border rounded-xl px-4 py-3
                focus:outline-none focus:ring-2
                focus:ring-black
              "
              placeholder="********"
            />

          </div>

          <button
            disabled={loading}
            className="
              w-full bg-black text-white
              rounded-xl py-3 font-medium
              hover:opacity-90 transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-500">

          ¿Ya tienes cuenta?

          <Link
            href="/login"
            className="
              ml-1 font-medium text-black
              hover:underline
            "
          >
            Iniciar sesión
          </Link>

        </div>

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";

import Link from "next/link";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await signIn(
          "credentials",
          {
            email,
            password,
            redirect: false,
          }
        );

      if (res?.error) {

        toast.error(
          "Credenciales incorrectas"
        );

        return;
      }

      toast.success(
        "Bienvenido"
      );

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

  async function handleGoogleLogin() {

    await signIn("google", {
      callbackUrl: "/",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border p-8">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            Iniciar sesión
          </h1>

          <p className="text-gray-500 mt-2">
            Accede a tu cuenta
          </p>

        </div>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="
            w-full border rounded-xl py-3
            font-medium hover:bg-gray-50
            transition mb-5
          "
        >
          Continuar con Google
        </button>

        <div className="relative mb-5">

          <div className="absolute inset-0 flex items-center">

            <div className="w-full border-t" />

          </div>

          <div className="relative flex justify-center text-xs uppercase">

            <span className="bg-white px-2 text-gray-500">
              o
            </span>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

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
                w-full mt-2 border rounded-xl
                px-4 py-3
                focus:outline-none
                focus:ring-2
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
                w-full mt-2 border rounded-xl
                px-4 py-3
                focus:outline-none
                focus:ring-2
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
              ? "Ingresando..."
              : "Ingresar"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-500">

          ¿No tienes cuenta?

          <Link
            href="/register"
            className="
              ml-1 font-medium text-black
              hover:underline
            "
          >
            Regístrate
          </Link>

        </div>

      </div>

    </div>
  );
}
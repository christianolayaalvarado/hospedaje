"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function NewPropertyPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      title: "",
      slug: "",
      description: "",
      basePrice: "",

    });

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch(
        "/api/admin/properties",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            ...form,

            basePrice: Number(
              form.basePrice
            ),

          }),

        }
      );

      if (!res.ok) {

        throw new Error(
          "Error creando propiedad"
        );

      }

      router.push(
        "/admin/properties"
      );

      router.refresh();

    } catch (error) {

      console.error(error);

      alert(
        "Error creando propiedad"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-6
        md:p-10
      "
    >

      <div className="max-w-3xl mx-auto">

        <div className="mb-8">

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Nueva propiedad
          </h1>

          <p
            className="
              mt-2
              text-gray-500
            "
          >
            Crear hospedaje
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
            rounded-3xl
            border
            bg-white
            p-8
            shadow-sm
          "
        >

          {/* TITLE */}

          <div>

            <label className="mb-2 block">

              Título

            </label>

            <input
              type="text"

              required

              value={form.title}

              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }

              className="
                w-full
                rounded-xl
                border
                p-4
              "
            />

          </div>

          {/* SLUG */}

          <div>

            <label className="mb-2 block">

              Slug

            </label>

            <input
              type="text"

              required

              value={form.slug}

              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }

              className="
                w-full
                rounded-xl
                border
                p-4
              "
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block">

              Descripción

            </label>

            <textarea

              required

              rows={6}

              value={form.description}

              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }

              className="
                w-full
                rounded-xl
                border
                p-4
              "
            />

          </div>

          {/* PRICE */}

          <div>

            <label className="mb-2 block">

              Precio Base

            </label>

            <input
              type="number"

              required

              value={form.basePrice}

              onChange={(e) =>
                setForm({
                  ...form,
                  basePrice:
                    e.target.value,
                })
              }

              className="
                w-full
                rounded-xl
                border
                p-4
              "
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"

            disabled={loading}

            className="
              rounded-xl
              bg-black
              px-6
              py-4
              text-white
              disabled:opacity-50
            "
          >

            {loading
              ? "Creando..."
              : "Crear propiedad"}

          </button>

        </form>

      </div>

    </div>

  );

}
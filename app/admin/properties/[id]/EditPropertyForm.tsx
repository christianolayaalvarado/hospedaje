"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

type Property = {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
};

type Props = {
  property: Property;
};

export default function EditPropertyForm({
  property,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [form, setForm] =
    useState({

      title: property.title,

      slug: property.slug,

      description:
        property.description,

      basePrice:
        property.basePrice.toString(),

    });

  // UPDATE
  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch(
        `/api/admin/properties/${property.id}`,
        {

          method: "PATCH",

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
          "Error actualizando"
        );

      }

      router.refresh();

      alert(
        "Propiedad actualizada"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error actualizando"
      );

    } finally {

      setLoading(false);

    }

  }

  // DELETE
  async function handleDelete() {

    try {

      setDeleting(true);

      const res = await fetch(
        `/api/admin/properties/${property.id}`,
        {

          method: "DELETE",

        }
      );

      if (!res.ok) {

        throw new Error(
          "Error eliminando"
        );

      }

      router.push(
        "/admin/properties"
      );

      router.refresh();

    } catch (error) {

      console.error(error);

      alert(
        "Error eliminando"
      );

    } finally {

      setDeleting(false);

      setShowDeleteModal(false);

    }

  }

  return (

    <>

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

          <label
            className="
              mb-2
              block
              font-medium
            "
          >
            Título
          </label>

          <input
            type="text"
            required
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
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

        {/* SLUG */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
            "
          >
            Slug
          </label>

          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug:
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

        {/* DESCRIPTION */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
            "
          >
            Descripción
          </label>

          <textarea
            rows={5}
            required
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

          <label
            className="
              mb-2
              block
              font-medium
            "
          >
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

        {/* ACTIONS */}

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={loading}
            className="
              rounded-xl
              bg-black
              px-6
              py-4
              text-white
            "
          >

            {loading
              ? "Guardando..."
              : "Guardar cambios"}

          </button>

          <button
            type="button"
            onClick={() =>
              setShowDeleteModal(true)
            }
            className="
              rounded-xl
              bg-red-600
              px-6
              py-4
              text-white
            "
          >
            Eliminar
          </button>

        </div>

      </form>

      {/* DELETE MODAL */}

      {showDeleteModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-8
              shadow-2xl
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Eliminar propiedad
            </h2>

            <p
              className="
                mt-3
                text-gray-500
              "
            >
              Esta acción no se puede deshacer.
            </p>

            <div
              className="
                mt-8
                flex
                justify-end
                gap-3
              "
            >

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="
                  rounded-xl
                  border
                  px-5
                  py-3
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="
                  rounded-xl
                  bg-red-600
                  px-5
                  py-3
                  text-white
                "
              >

                {deleting
                  ? "Eliminando..."
                  : "Sí, eliminar"}

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}
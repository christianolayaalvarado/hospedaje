"use client";

import Image from "next/image";
import { gallerySections } from "@/lib/galleryData";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function TourPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const router = useRouter();

  function scrollToSection(id: string) {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function openModal(images: string[], index: number) {
    setActiveImages(images);
    setActiveIndex(index);
  }

  function closeModal() {
    setActiveIndex(null);
    setActiveImages([]);
  }

  function next() {
    setActiveIndex((prev) =>
      prev !== null ? (prev + 1) % activeImages.length : 0
    );
  }

  function prev() {
    setActiveIndex((prev) =>
      prev !== null
        ? (prev - 1 + activeImages.length) % activeImages.length
        : 0
    );
  }

  return (
    <div className="bg-white">

      {/* 🔙 BOTÓN VOLVER (MEJORADO) */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-md hover:scale-105 active:scale-95 transition"
      >
        ← <span className="text-sm">Volver</span>
      </button>

      {/* 🔥 HEADER */}
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Recorrido Fotográfico
        </h1>
      </div>

      {/* 🔥 NAVBAR MINIATURAS (FIX MOBILE) */}
      <div className="sticky top-0 z-40 bg-white border-b py-4">

        <div className="relative">

          {/* SCROLL */}
          <div className="flex gap-4 overflow-x-auto px-4 snap-x snap-mandatory">

            {gallerySections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="flex flex-col items-center min-w-[110px] snap-start group"
              >
                <div className="relative w-28 h-20 rounded-xl overflow-hidden">
                  <Image
                    src={section.images?.[0] ?? "/placeholder.jpg"}
                    alt={section.title}
                    fill
                    sizes="112px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </div>

                <span className="text-sm mt-2 text-gray-500 group-hover:text-black transition">
                  {section.title}
                </span>
              </button>
            ))}

          </div>

          {/* FADE DERECHO (indica scroll) */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />

        </div>
      </div>

      {/* 🔥 CONTENIDO */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-24">

        {gallerySections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >

            {/* 🔹 INFO */}
            <div className="md:col-span-1">
              <div className="md:sticky md:top-32 space-y-2">
                <h2 className="text-[28px] md:text-[30px] font-semibold leading-tight">
                  {section.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {section.description}
                </p>
              </div>
            </div>

            {/* 🔹 IMÁGENES */}
            <div className="md:col-span-3 grid grid-cols-2 gap-4">

              {section.images.length >= 3 ? (
                <>
                  {/* PRINCIPAL */}
                  <div
                    onClick={() => openModal(section.images, 0)}
                    className="col-span-2 relative h-[300px] md:h-[350px] rounded-xl overflow-hidden cursor-pointer group active:scale-[0.98] transition"
                  >
                    <Image
                      src={section.images[0]}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                  </div>

                  {/* SECUNDARIAS */}
                  {section.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      onClick={() => openModal(section.images, i + 1)}
                      className="relative h-[160px] md:h-[200px] rounded-xl overflow-hidden cursor-pointer group active:scale-[0.98] transition"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                      {/* mini hint */}
                      <div className="absolute bottom-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition">
                        Ver
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                section.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => openModal(section.images, i)}
                    className="relative h-[220px] md:h-[250px] rounded-xl overflow-hidden cursor-pointer group active:scale-[0.98] transition"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width:768px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                  </div>
                ))
              )}

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 MODAL */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">

          {/* CERRAR */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white text-2xl hover:scale-110 transition"
          >
            ✕
          </button>

          {/* IMAGEN */}
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={activeImages[activeIndex]}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* NAV */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-6 text-white text-4xl hover:scale-110 transition"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-4 md:right-6 text-white text-4xl hover:scale-110 transition"
          >
            ›
          </button>

        </div>
      )}

    </div>
  );
}
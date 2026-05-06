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

      {/* 🔝 HEADER */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">

        {/* 🔙 BOTÓN VOLVER */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <span className="text-xl">←</span>
          <span className="text-sm font-medium">Volver</span>
        </button>

        {/* 🔥 TÍTULO */}
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-center">
          Recorrido Fotográfico
        </h1>

        {/* espacio balance */}
        <div className="w-[80px]" />
      </div>

      {/* 🔥 NAVBAR MINIATURAS */}
      <div
        id="tour-navbar"
        className="sticky top-0 z-40 bg-white border-b"
      >
        <div className="max-w-6xl mx-auto relative">

          {/* SCROLL */}
          <div className="flex gap-4 overflow-x-auto px-4 py-4 snap-x snap-mandatory">

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

          {/* fade scroll */}
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
            className="grid grid-cols-1 md:grid-cols-4 gap-8 scroll-mt-40 md:scroll-mt-48"
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
            <div className="md:col-span-3">

              {section.images.length >= 5 ? (
                <>
                  {/* ================= MOBILE ================= */}
                  <div className="md:hidden space-y-2">

                    {/* PRINCIPAL */}
                    <div
                      onClick={() => openModal(section.images, 0)}
                      className="relative h-[240px] rounded-2xl overflow-hidden cursor-pointer group"
                    >
                      <Image
                        src={section.images[0]}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition" />
                    </div>

                    {/* 4 MINIATURAS */}
                    <div className="grid grid-cols-2 gap-2">

                      {section.images.slice(1, 5).map((img, i) => (
                        <div
                          key={i}
                          onClick={() => openModal(section.images, i + 1)}
                          className="relative h-[110px] rounded-xl overflow-hidden cursor-pointer group"
                        >
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="50vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition" />

                          {/* hint */}
                          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition">
                            <span className="bg-white/90 text-black text-[10px] px-2 py-1 rounded-full font-medium">
                              Ver
                            </span>
                          </div>
                        </div>
                      ))}

                    </div>

                  </div>

                  {/* ================= DESKTOP ================= */}
                  <div className="hidden md:grid grid-cols-2 gap-4">

                    {/* PRINCIPAL */}
                    <div
                      onClick={() => openModal(section.images, 0)}
                      className="col-span-2 relative h-[350px] rounded-xl overflow-hidden cursor-pointer group active:scale-[0.98] transition"
                    >
                      <Image
                        src={section.images[0]}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                    </div>

                    {/* SECUNDARIAS */}
                    {section.images.slice(1).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => openModal(section.images, i + 1)}
                        className="relative h-[200px] rounded-xl overflow-hidden cursor-pointer group active:scale-[0.98] transition"
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                        {/* hint */}
                        <div className="absolute bottom-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition">
                          Ver
                        </div>
                      </div>
                    ))}

                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">

                  {section.images.map((img, i) => (
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
                  ))}

                </div>
              )}

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 MODAL */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">

          {/* cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white text-2xl hover:scale-110 transition"
          >
            ✕
          </button>

          {/* imagen */}
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={activeImages[activeIndex]}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* navegación */}
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
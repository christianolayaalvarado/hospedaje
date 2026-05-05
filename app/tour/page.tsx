"use client";

import Image from "next/image";
import { gallerySections } from "@/lib/galleryData";
import { useRef, useState } from "react";

export default function TourPage() {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeImages, setActiveImages] = useState<string[]>([]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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

      {/* 🔥 HEADER */}
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Recorrido Fotográfico
        </h1>
      </div>

      {/* 🔥 NAVBAR MINIATURAS */}
      <div className="sticky top-0 z-50 bg-white border-b py-4 flex justify-center gap-6 overflow-x-auto px-4">

        {gallerySections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="flex flex-col items-center min-w-[110px] group"
          >
            <div className="relative w-32 h-32 rounded-xl overflow-hidden">
              <Image
                src={section.images?.[0] || "/placeholder.jpg"}
                alt={section.title}
                fill
                sizes="128px"
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

            {/* IZQUIERDA */}
            <div className="md:col-span-1">
              <div className="md:sticky md:top-32 space-y-2">
                <h2 className="text-[32px] font-semibold leading-tight">
                  {section.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {section.description}
                </p>
              </div>
            </div>

            {/* GRID */}
            <div className="md:col-span-3 grid grid-cols-2 gap-4">

              {section.images.length >= 3 ? (
                <>
                  {/* GRANDE */}
                  <div
                    onClick={() => openModal(section.images, 0)}
                    className="col-span-2 relative h-[350px] rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={section.images[0]}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* RESTO */}
                  {section.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      onClick={() => openModal(section.images, i + 1)}
                      className="relative h-[200px] rounded-xl overflow-hidden cursor-pointer group"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </>
              ) : (
                section.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => openModal(section.images, i)}
                    className="relative h-[250px] rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width:768px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ))
              )}

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 MODAL FULLSCREEN */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">

          {/* cerrar */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl"
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
            className="absolute left-6 text-white text-4xl"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-6 text-white text-4xl"
          >
            ›
          </button>

        </div>
      )}

    </div>
  );
}
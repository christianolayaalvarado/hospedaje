"use client";

import Image from "next/image";
import { gallerySections } from "@/lib/galleryData";
import { useRef } from "react";

export default function FotosPage() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  function scrollToSection(id: string) {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="bg-white">

      {/* HEADER */}
      <div className="text-center py-8">
        <h1 className="text-xl font-semibold">
          Recorrido Fotográfico
        </h1>
      </div>

      {/* NAVBAR MINIATURAS */}
      <div className="sticky top-0 z-50 bg-white border-b py-4 flex justify-center gap-4 overflow-x-auto">

        {gallerySections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="flex flex-col items-center min-w-[100px]"
          >
            <div className="relative w-24 h-16 rounded-lg overflow-hidden">
              <Image
                src={section.images?.[0] ?? "/placeholder.jpg"} // 🔥 FIX REAL
                alt={section.title}
                fill
                sizes="96px"
                className="object-cover hover:scale-105 transition"
              />
            </div>

            <span className="text-sm mt-2 text-gray-500">
              {section.title}
            </span>
          </button>
        ))}

      </div>

      {/* CONTENIDO */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-24">

        {gallerySections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >

            {/* INFO */}
            <div className="md:col-span-1">
              <div className="md:sticky md:top-32 space-y-2">
                <h2 className="text-[30px] font-semibold">
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
                  <div className="col-span-2 relative h-[350px] rounded-xl overflow-hidden">
                    <Image
                      src={section.images[0]}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  {section.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative h-[200px] rounded-xl overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </>
              ) : (
                section.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-[250px] rounded-xl overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width:768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
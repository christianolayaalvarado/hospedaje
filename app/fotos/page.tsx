"use client";

import Image from "next/image";
import { gallerySections } from "@/lib/galleryData";

export default function FotosPage() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="bg-white">

      {/* NAVBAR MINIATURAS */}
      <div className="sticky top-0 z-50 bg-white border-b p-4 flex gap-4 overflow-x-auto">
        {gallerySections.map((section) => (
          <div
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="cursor-pointer min-w-[100px]"
          >
            <div className="relative w-24 h-16 rounded-lg overflow-hidden">
              <Image
                src={section.cover}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs mt-1 text-center">
              {section.title}
            </p>
          </div>
        ))}
      </div>

      {/* CONTENIDO */}
      <div className="max-w-6xl mx-auto p-10 space-y-20">

        {gallerySections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="grid grid-cols-3 gap-10"
          >
            {/* LABEL IZQUIERDA (STICKY) */}
            <div className="col-span-1">
              <div className="sticky top-32">
                <h2 className="text-2xl font-semibold">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* IMÁGENES DERECHA */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {section.images.map((img, i) => (
                <div key={i} className="relative w-full h-60">
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover rounded-xl hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
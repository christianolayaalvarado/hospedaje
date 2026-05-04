"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Category = "todas" | "habitaciones" | "banos" | "exteriores";

const images = [
  { src: "/images/habitaciones/1.jpg", cat: "habitaciones" },
  { src: "/images/habitaciones/2.jpg", cat: "habitaciones" },
  { src: "/images/banos/1.jpg", cat: "banos" },
  { src: "/images/exteriores/1.jpg", cat: "exteriores" },
  { src: "/images/exteriores/2.jpg", cat: "exteriores" },
];

export default function GalleryAirbnb() {
  const router = useRouter(); // 👈 ACTIVAR ROUTER

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState<Category>("todas");

  const filtered =
    category === "todas"
      ? images
      : images.filter((img) => img.cat === category);

  function next() {
    setIndex((prev) => (prev + 1) % filtered.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  }

  return (
    <div className="space-y-6">

      {/* HEADER + BOTÓN TOUR */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {["todas", "habitaciones", "banos", "exteriores"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as Category)}
              className={`px-4 py-2 rounded-full border ${
                category === cat
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 👇 BOTÓN CLAVE */}
        <button
          onClick={() => router.push("/tour")}
          className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Ver recorrido fotográfico
        </button>
      </div>

      {/* GRID TIPO AIRBNB */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden">

        {/* Imagen grande */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => { setOpen(true); setIndex(0); }}
        >
          <Image
            src={filtered[0].src}
            alt=""
            fill
            className="object-cover hover:scale-105 transition"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* 4 pequeñas */}
        {filtered.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            onClick={() => { setOpen(true); setIndex(i + 1); }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover hover:scale-105 transition"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* MODAL FULLSCREEN */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Cerrar */}
            <button
              className="absolute top-5 right-5 text-white text-2xl"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {/* Imagen */}
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-[90vw] h-[80vh]"
            >
              <Image
                src={filtered[index].src}
                alt=""
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Navegación */}
            <button
              onClick={prev}
              className="absolute left-5 text-white text-3xl"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute right-5 text-white text-3xl"
            >
              ›
            </button>

            {/* Contador */}
            <div className="absolute bottom-5 text-white">
              {index + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
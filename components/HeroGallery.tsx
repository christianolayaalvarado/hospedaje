"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/habitaciones/1.jpg",
  "/images/habitaciones/2.jpg",
  "/images/banos/1.jpg",
  "/images/exteriores/1.jpg",
  "/images/exteriores/2.jpg",
];

export default function HeroGallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function next() {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function prev() {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden mt-5">

        {/* GRANDE */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => { setIndex(0); setOpen(true); }}
        >
          <Image
            src={images[0]}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
            className="object-cover hover:scale-105 transition duration-500"
          />
        </div>

        {/* PEQUEÑAS */}
        {images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            onClick={() => { setIndex(i + 1); setOpen(true); }}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL="/images/placeholder.jpg"
              className="object-cover hover:scale-105 transition duration-500"
            />
          </div>
        ))}
      </div>

      {/* MODAL PRO */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* CERRAR */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl z-50"
            >
              ✕
            </button>

            {/* IMAGEN CON SWIPE */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">

              <motion.div
                key={index}
                className="relative w-[90%] h-[80%]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) next();
                  if (info.offset.x > 100) prev();
                }}
              >
                <Image
                  src={images[index]}
                  alt=""
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL="/images/placeholder.jpg"
                  className="object-contain"
                />
              </motion.div>
            </div>

            {/* BOTONES DESKTOP */}
            <button
              onClick={prev}
              className="hidden md:block absolute left-6 text-white text-5xl"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="hidden md:block absolute right-6 text-white text-5xl"
            >
              ›
            </button>

            {/* INDICADORES */}
            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
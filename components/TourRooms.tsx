"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Room = {
  name: string;
  description: string;
  images: string[];
};

const rooms: Room[] = [
  {
    name: "Sala",
    description: "Espacio amplio con vista al parque",
    images: [
      "/images/exteriores/1.jpg",
      "/images/exteriores/2.jpg",
    ],
  },
  {
    name: "Dormitorio",
    description: "Cama queen con iluminación natural",
    images: [
      "/images/habitaciones/1.jpg",
      "/images/habitaciones/2.jpg",
    ],
  },
  {
    name: "Baño",
    description: "Baño moderno con ducha caliente",
    images: [
      "/images/banos/1.jpg",
    ],
  },
];

export default function TourRooms() {
  const [open, setOpen] = useState(false);
  const [roomIndex, setRoomIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);

  const room = rooms[roomIndex];

  function nextRoom() {
    setRoomIndex((prev) => (prev + 1) % rooms.length);
    setImgIndex(0);
  }

  function prevRoom() {
    setRoomIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
    setImgIndex(0);
  }

  function nextImage() {
    setImgIndex((prev) => (prev + 1) % room.images.length);
  }

  function prevImage() {
    setImgIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  }

  return (
    <div className="mt-10">

      {/* BOTÓN */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Ver recorrido por habitaciones
      </button>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {/* HEADER */}
            <div className="flex justify-between items-center p-6 text-white">
              <h2 className="text-xl font-semibold">
                {room.name}
              </h2>

              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* CONTENIDO */}
            <div className="flex flex-1 items-center justify-center relative">

              {/* Imagen */}
              <motion.div
                key={imgIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-[90vw] h-[70vh]"
              >
                <Image
                  src={room.images[imgIndex]}
                  alt=""
                  fill
                  className="object-contain"
                />
              </motion.div>

              {/* Navegación imágenes */}
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-5 text-white text-3xl"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-5 text-white text-3xl"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* DESCRIPCIÓN */}
            <div className="text-center text-white mb-4">
              {room.description}
            </div>

            {/* FOOTER navegación habitaciones */}
            <div className="flex justify-between items-center p-6 text-white">

              <button onClick={prevRoom}>
                ← Anterior
              </button>

              <div>
                {roomIndex + 1} / {rooms.length}
              </div>

              <button onClick={nextRoom}>
                Siguiente →
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
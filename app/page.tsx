"use client";

import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import MaterialIcon from "@/components/MaterialIcon";
import BookingSidebar from "@/components/BookingSidebar";
import Skeleton from "@/components/Skeleton";
import NearbyPlaces from "@/components/NearbyPlaces";
import ReviewsSection from "@/components/ReviewsSection";
import GalleryLightbox from "@/components/GalleryLightbox";

const LocationMap = dynamic(
  () => import("@/components/LocationMap"),
  {
    ssr: false,
  }
);

export default function Home() {

  const router = useRouter();

  // =========================================================
  // 📅 ESTADO GLOBAL
  // =========================================================

  const [startDate, setStartDate] =
    useState<Date | null>(null);

  const [endDate, setEndDate] =
    useState<Date | null>(null);

  // =========================================================
  // 🔥 SKELETON IMAGES
  // =========================================================

  const [loadedImages, setLoadedImages] =
    useState<Record<string, boolean>>({});

  // =========================================================
  // 🖼️ IMÁGENES
  // =========================================================

  const images = [
    "/images/habitaciones/1.jpg",
    "/images/habitaciones/2.jpg",
    "/images/sala/2.jpg",
    "/images/exteriores/1.jpg",
    "/images/cocina/1.jpg",
  ];

  const slides = images.map((src) => ({
    src,
  }));

  // =========================================================
  // 🔥 LIGHTBOX
  // =========================================================

  const [openGallery, setOpenGallery] =
    useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  // =========================================================
  // 🔥 MODAL SERVICIOS
  // =========================================================

  const [openServicios, setOpenServicios] =
    useState(false);

  // =========================================================
  // 🔥 PROPERTY ID REAL
  // =========================================================

  const propertyId =
    "69ff5d9f1eb200b5fe5c4d38";

  // =========================================================
  // 🛏️ SERVICIOS
  // =========================================================

  const servicios = [
    { icon: "wifi", label: "Wifi" },
    { icon: "tv", label: "TV en sala" },
    { icon: "tv", label: "TV en dormitorio principal" },
    { icon: "shower", label: "Agua caliente" },
    { icon: "local_laundry_service", label: "Lavadora" },
    { icon: "cleaning_services", label: "Servicios básicos" },
    { icon: "dresser", label: "Ropero" },
    { icon: "checkroom", label: "Ganchos para ropa" },
    { icon: "bed", label: "Sábanas" },
    { icon: "kitchen", label: "Refrigerador" },
    { icon: "restaurant", label: "Cocina" },
    { icon: "table_restaurant", label: "Mesa de comedor" },
    { icon: "kettle", label: "Hervidor de agua" },
    { icon: "coffee", label: "Cafetera" },
    { icon: "blender", label: "Licuadora" },
    { icon: "microwave", label: "Microondas" },
    { icon: "local_pizza", label: "Pizzería cercana" },
    {
      icon: "local_laundry_service",
      label: "Lavandería cercana",
    },
    { icon: "directions_car", label: "Parking en calle" },
    { icon: "elevator", label: "Ascensor" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">

      {/* ========================================================= */}
      {/* 🔥 TÍTULO */}
      {/* ========================================================= */}

      <div className="text-center space-y-2">

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          HOSPEDAJE R&E B
        </h1>

        <p className="text-gray-500">
          Vive una experiencia cómoda y acogedora en San Miguel
        </p>

      </div>

      {/* ========================================================= */}
      {/* 🧱 LAYOUT */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ========================================================= */}
        {/* CONTENIDO */}
        {/* ========================================================= */}

        <div className="md:col-span-2 space-y-10">

          {/* ========================================================= */}
          {/* 🔥 GALERÍA MOBILE */}
          {/* ========================================================= */}

          <div className="md:hidden space-y-2">

            {/* PRINCIPAL */}
            <div
              className="
                relative
                aspect-[4/3]
                rounded-2xl
                overflow-hidden
                cursor-pointer
                group
                active:scale-[.98]
                transition
              "
            >

              {!loadedImages[images[0]] && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
              )}

              <Image
                src={images[0]}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-105
                  ${
                    loadedImages[images[0]]
                      ? "opacity-100 blur-0 scale-100"
                      : "opacity-0 blur-2xl scale-105"
                  }
                `}
                onLoad={() =>
                  setLoadedImages((prev) => ({
                    ...prev,
                    [images[0]]: true,
                  }))
                }
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition" />

              {/* BOTONES INFERIORES */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">

                {/* LIGHTBOX */}
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setOpenGallery(true);
                  }}
                  className="
                    w-12 h-12
                    rounded-full
                    backdrop-blur-md
                    bg-white/20
                    border border-white/30
                    text-white
                    flex items-center justify-center
                    hover:scale-105
                    transition
                    shadow-lg
                  "
                >

                  <MaterialIcon
                    name="photo_library"
                    className="text-[22px]"
                  />

                </button>

                {/* TOUR COMPLETO */}
                <button
                  onClick={() => router.push("/tour")}
                  className="
                    backdrop-blur-md
                    bg-white/20
                    text-white
                    px-5 py-3
                    rounded-xl
                    border border-white/30
                    hover:bg-white/30
                    transition
                    shadow-lg
                    font-medium
                  "
                >
                  Tour completo →
                </button>

              </div>

            </div>

            {/* MINIATURAS */}
            <div className="grid grid-cols-2 gap-2">

              {images.slice(1, 5).map((img, i) => (

                <div
                  key={i}
                  className="
                    relative
                    aspect-[4/3]
                    rounded-xl
                    overflow-hidden
                    cursor-pointer
                    group
                    active:scale-[.98]
                    transition
                  "
                  onClick={() => {
                    setCurrentIndex(i + 1);
                    setOpenGallery(true);
                  }}
                >

                  {!loadedImages[img] && (
                    <Skeleton className="absolute inset-0 rounded-xl" />
                  )}

                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="50vw"
                    className={`
                      object-cover
                      transition-all
                      duration-500
                      group-hover:scale-105
                      ${
                        loadedImages[img]
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    `}
                    onLoad={() =>
                      setLoadedImages((prev) => ({
                        ...prev,
                        [img]: true,
                      }))
                    }
                  />

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition" />

                </div>

              ))}

            </div>

          </div>

          {/* ========================================================= */}
          {/* 🔥 GALERÍA DESKTOP */}
          {/* ========================================================= */}

          <div
            className="
              hidden md:grid
              grid-cols-4
              grid-rows-2
              gap-2
              h-[500px]
              rounded-xl
              overflow-hidden
            "
          >

            {/* PRINCIPAL */}
            <div
              className="
                col-span-2
                row-span-2
                relative
                cursor-pointer
                group
                overflow-hidden
                active:scale-[.97]
                transition
                duration-200
              "
            >

              {!loadedImages[images[0]] && (
                <Skeleton className="absolute inset-0" />
              )}

              <Image
                src={images[0]}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                  ${
                    loadedImages[images[0]]
                      ? "opacity-100"
                      : "opacity-0"
                  }
                `}
                onLoad={() =>
                  setLoadedImages((prev) => ({
                    ...prev,
                    [images[0]]: true,
                  }))
                }
              />

              {/* Overlay */}
              <div
                className="
                  absolute inset-0
                  bg-black/10
                  group-hover:bg-black/30
                  transition
                "
              />

              {/* BOTONES */}
              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  right-5
                  flex
                  items-end
                  justify-between
                "
              >

                {/* LIGHTBOX */}
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setOpenGallery(true);
                  }}
                  className="
                    w-14 h-14
                    rounded-full
                    backdrop-blur-md
                    bg-white/20
                    border border-white/30
                    text-white
                    flex items-center justify-center
                    hover:bg-white/30
                    hover:scale-105
                    transition
                    shadow-lg
                  "
                >

                  <MaterialIcon
                    name="photo_library"
                    className="text-[26px]"
                  />

                </button>

                {/* TOUR COMPLETO */}
                <button
                  onClick={() => router.push("/tour")}
                  className="
                    backdrop-blur-md
                    bg-white/20
                    text-white
                    px-6 py-3
                    rounded-xl
                    border border-white/30
                    hover:bg-white/30
                    transition
                    shadow-lg
                    font-medium
                  "
                >
                  Tour completo →
                </button>

              </div>

            </div>

            {/* SECUNDARIAS */}
            {images.slice(1, 5).map((img, i) => (

              <div
                key={i}
                className="
                  relative
                  cursor-pointer
                  group
                  overflow-hidden
                  active:scale-[.98]
                  transition
                "
                onClick={() => {
                  setCurrentIndex(i + 1);
                  setOpenGallery(true);
                }}
              >

                {!loadedImages[img] && (
                  <Skeleton className="absolute inset-0" />
                )}

                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`
                    object-cover
                    transition-all
                    duration-500
                    group-hover:scale-[1.05]
                    ${
                      loadedImages[img]
                        ? "opacity-100 blur-0 scale-100"
                        : "opacity-0 blur-2xl scale-105"
                    }
                  `}
                  onLoad={() =>
                    setLoadedImages((prev) => ({
                      ...prev,
                      [img]: true,
                    }))
                  }
                />

                <div
                  className="
                    absolute inset-0
                    bg-black/0
                    group-hover:bg-black/30
                    transition
                  "
                />

              </div>

            ))}

          </div>

          {/* ========================================================= */}
          {/* 🔥 INFO */}
          {/* ========================================================= */}

          <div className="space-y-6">

            <div id="servicios">

              <h2 className="text-2xl font-semibold">
                Alojamiento entero en San Miguel, Perú
              </h2>

              <p className="text-gray-600 mt-1">
                6 huéspedes · 3 habitaciones · 3 camas · 2 baños
              </p>

            </div>

            {/* SERVICIOS */}
            <div className="border-t pt-6 space-y-3">

              <h3 className="text-lg font-semibold">
                Lo que este lugar ofrece
              </h3>

              <div className="grid grid-cols-2 gap-4">

                {servicios.slice(0, 6).map((item, i) => (

                  <div
                    key={i}
                    className="
                      flex items-center gap-3
                      hover:translate-x-1
                      transition
                    "
                  >

                    <MaterialIcon
                      name={item.icon}
                      className="text-gray-600 text-[22px]"
                    />

                    <span>{item.label}</span>

                  </div>

                ))}

              </div>

              <button
                onClick={() => setOpenServicios(true)}
                className="underline font-medium hover:opacity-70"
              >
                Mostrar todos los servicios
              </button>

            </div>

            {/* UBICACIÓN */}
            <div
              id="ubicacion"
              className="border-t pt-6 space-y-4"
            >

              <div>

                <h3 className="text-lg font-semibold">
                  Donde estarás
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Ubicado en San Miguel, Lima.
                  Cerca de restaurantes, supermercados,
                  zonas turísticas y a pocos minutos
                  del aeropuerto.
                </p>

              </div>

              <LocationMap />

              <NearbyPlaces />

              <ReviewsSection />

            </div>

            {/* CONTACTO */}
            <div
              id="contacto"
              className="border-t pt-6 space-y-3"
            >

              <h3 className="text-lg font-semibold">
                Contacto
              </h3>

              <p className="text-gray-600">
                ¿Tienes dudas? Contáctanos por WhatsApp
                para más información sobre disponibilidad
                y reservas.
              </p>

              <button
                className="
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  px-5 py-3
                  rounded-xl
                  font-medium
                  transition
                "
              >
                WhatsApp
              </button>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 🔥 SIDEBAR */}
        {/* ========================================================= */}

        <BookingSidebar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          propertyId={propertyId}
        />

      </div>

      {/* ========================================================= */}
      {/* 🔥 MODAL SERVICIOS */}
      {/* ========================================================= */}

      {openServicios && (

        <div
          className="
            fixed inset-0
            bg-black/50
            z-50
            flex justify-center items-center
          "
        >

          <div
            className="
              bg-white
              w-full
              max-w-2xl
              p-6
              rounded-xl
              max-h-[80vh]
              overflow-y-auto
            "
          >

            <div className="flex justify-between mb-4">

              <h2 className="text-xl font-semibold">
                Servicios
              </h2>

              <button
                onClick={() => setOpenServicios(false)}
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {servicios.map((item, i) => (

                <div
                  key={i}
                  className="
                    flex items-center gap-3
                    hover:translate-x-1
                    transition
                  "
                >

                  <MaterialIcon
                    name={item.icon}
                    className="text-gray-600 text-[22px]"
                  />

                  <span>{item.label}</span>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

      {/* ========================================================= */}
      {/* 🔥 LIGHTBOX */}
      {/* ========================================================= */}

      <GalleryLightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        index={currentIndex}
        slides={slides}
      />

    </div>
  );
}
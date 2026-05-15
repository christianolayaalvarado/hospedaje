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

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  // =========================
  // FECHAS
  // =========================
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // =========================
  // IMÁGENES
  // =========================
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
    {}
  );

  const images = [
    "/images/habitaciones/1.jpg",
    "/images/habitaciones/2.jpg",
    "/images/sala/2.jpg",
    "/images/exteriores/1.jpg",
    "/images/cocina/1.jpg",
  ];

  const slides = images.map((src) => ({ src }));

  // =========================
  // LIGHTBOX
  // =========================
  const [openGallery, setOpenGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // =========================
  // SERVICIOS MODAL
  // =========================
  const [openServicios, setOpenServicios] = useState(false);

  const servicios = [
    { icon: "wifi", label: "Wifi" },
    { icon: "tv", label: "TV en sala" },
    { icon: "tv", label: "TV en dormitorio principal" },
    { icon: "shower", label: "Agua caliente" },
    { icon: "local_laundry_service", label: "Lavadora" },
    { icon: "cleaning_services", label: "Servicios básicos" },
    { icon: "bed", label: "Sábanas" },
    { icon: "kitchen", label: "Cocina" },
    { icon: "directions_car", label: "Parking en calle" },
  ];

  // 🔥 FIX CLAVE: define propertyId
  const propertyId = "69ff5d9f1eb200b5fe5c4d38"; // <-- id real de Property de tu DB

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">
          HOSPEDAJE R&E B
        </h1>
        <p className="text-gray-500">
          Vive una experiencia cómoda en San Miguel
        </p>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CONTENIDO */}
        <div className="md:col-span-2 space-y-10">
          {/* GALERÍA */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl"
                onClick={() => {
                  setCurrentIndex(i);
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
                  className="object-cover"
                  onLoad={() =>
                    setLoadedImages((prev) => ({
                      ...prev,
                      [img]: true,
                    }))
                  }
                />
              </div>
            ))}
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Alojamiento entero en San Miguel
            </h2>

            <LocationMap />
            <NearbyPlaces />
            <ReviewsSection />
          </div>
        </div>

        {/* 🔥 SIDEBAR (CORREGIDO) */}
        <BookingSidebar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          propertyId={propertyId} // ✅ FIX IMPORTANTE
        />
      </div>

      {/* SERVICIOS MODAL */}
      {openServicios && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-xl w-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Servicios</h2>
              <button onClick={() => setOpenServicios(false)}>✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {servicios.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <MaterialIcon name={s.icon} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      <GalleryLightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        index={currentIndex}
        slides={slides}
      />
    </div>
  );
}
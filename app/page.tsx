"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";
import BookingSidebar from "@/components/BookingSidebar";
import CalendarAirbnb from "@/components/CalendarAirbnb";
import { getPrecioPorDia } from "@/lib/pricing";

export default function Home() {
  const router = useRouter();

  // 📅 ESTADO GLOBAL
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const images = [
    "/images/habitaciones/1.jpg",
    "/images/habitaciones/2.jpg",
    "/images/sala/2.jpg",
    "/images/exteriores/1.jpg",
    "/images/cocina/1.jpg",
  ];

  const [openServicios, setOpenServicios] = useState(false);

  // 💰 PRECIO DINÁMICO
  

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
    { icon: "local_laundry_service", label: "Lavandería cercana" },
    { icon: "directions_car", label: "Parking en calle" },
    { icon: "elevator", label: "Ascensor" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* 🔥 TÍTULO */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          HOSPEDAJE R&E BROWN
        </h1>
        <p className="text-gray-500">
          Vive una experiencia cómoda y moderna en San Miguel
        </p>
      </div>

      {/* 🧱 LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* CONTENIDO */}
        <div className="md:col-span-2 space-y-10">

          {/* 🔥 GALERÍA */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden">

            {/* PRINCIPAL */}
            <div
  className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden active:scale-[.97] transition duration-200"
  onClick={() => router.push("/tour")}
>
  <Image
    src={images[0]}
    alt=""
    fill
    className="object-cover transition duration-700 group-hover:scale-110"
    priority
  />

  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />

  <div className="absolute inset-0 flex items-center justify-center">
    <div className="backdrop-blur-md bg-white/20 text-white px-6 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition border border-white/30">
      Ver recorrido completo →
    </div>
  </div>
</div>

            {/* SECUNDARIAS */}
            {images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="relative cursor-pointer group overflow-hidden  active:scale-[.98] transition"
                onClick={() => router.push("/tour")}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                {/* Overlay oscuro */ }
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                {/* Texto pequeño */}
  <div className="absolute bottom-2 left-2 text-white text-sm opacity-0 group-hover:opacity-100 transition">
    Ver más
  </div>
              </div>
            ))}
          </div>

          {/* INFO */}
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-semibold">
                Alojamiento entero en San Miguel, Perú
              </h2>
              <p className="text-gray-600 mt-1">
                6 huéspedes · 3 habitaciones · 3 camas · 2 baños
              </p>
            </div>

            {/* 📅 CALENDARIO */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-lg font-semibold">
                Selecciona tus fechas
              </h3>

              <CalendarAirbnb
                onChange={({ from, to }) => {
                  setStartDate(from ?? null);
                  setEndDate(to ?? null);
                }}
                getPrecioPorDia={getPrecioPorDia}
              />
            </div>

            {/* SERVICIOS */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-lg font-semibold">
                Lo que este lugar ofrece
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {servicios.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 hover:translate-x-1 transition">
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

          </div>
        </div>

        {/* SIDEBAR */}
        <BookingSidebar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

      </div>

      {/* MODAL */}
      {openServicios && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Servicios</h2>
              <button onClick={() => setOpenServicios(false)}>✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {servicios.map((item, i) => (
                <div key={i} className="flex items-center gap-3 hover:translate-x-1 transition">
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

    </div>
  );
}
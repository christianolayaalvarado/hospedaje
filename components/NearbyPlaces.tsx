"use client";

import MaterialIcon from "./MaterialIcon";

const places = [
  {
    icon: "restaurant",
    title: "Restaurantes",
    desc: "A 3 min caminando",
  },

  {
    icon: "local_mall",
    title: "Plaza San Miguel",
    desc: "A 8 min en auto",
  },

  {
    icon: "directions_bus",
    title: "Transporte público",
    desc: "A 2 cuadras",
  },

  {
    icon: "local_hospital",
    title: "Clínicas y farmacias",
    desc: "Muy cerca",
  },

  {
    icon: "flight",
    title: "Aeropuerto Jorge Chávez",
    desc: "A 20 min",
  },

  {
    icon: "pets",
    title: "Parque de las Leyendas",
    desc: "A 05 min",
  },
];

export default function NearbyPlaces() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {places.map((place, i) => (

        <div
          key={i}
          className="
            flex items-start gap-4
            border rounded-2xl
            p-4
            hover:shadow-md
            hover:-translate-y-1
            transition
            bg-white
          "
        >

          <div
            className="
              h-12 w-12
              rounded-xl
              bg-gray-100
              flex items-center justify-center
              shrink-0
            "
          >

            <MaterialIcon
              name={place.icon}
              className="text-gray-700 text-[24px]"
            />

          </div>

          <div>

            <p className="font-medium">
              {place.title}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {place.desc}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
}
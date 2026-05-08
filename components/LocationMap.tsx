"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// 🔥 FIX ICONOS LEAFLET
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LocationMap() {

  // 📍 SAN MIGUEL LIMA
  const position: [number, number] = [
    -12.07500085972333,
    -77.09275198115539,
   
  ];

  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm">

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-[400px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            Hospedaje R&E B <br />
            San Miguel, Lima
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}
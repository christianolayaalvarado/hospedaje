export type GallerySection = {
  id: string;
  title: string;
  description: string;
  images: string[];
  cover?: string;
};

export const gallerySections:GallerySection[] = [
  {
    id: "sala",
    title: "Sala",
    description: "Amplia sala con ventanales y vista al parque.",
    images: [
      "/images/sala/1.jpg",
      "/images/sala/2.jpg",
      "/images/sala/3.jpg",
      "/images/sala/4.jpg",
    ],
  },
  {
    id: "comedor",
    title: "Comedor",
    description: "Mesa de comedor con asientos para 8 personas.",
    images: [
      "/images/comedor/1.jpg",
      "/images/comedor/2.jpg",
      "/images/comedor/3.jpg",
      "/images/comedor/4.jpg",
      "/images/comedor/5.jpg",
    ],
  },
  {
    id: "cocina",
    title: "Cocina",
    description: "Cocina moderna con encimera de granito.",
    images: [
      "/images/cocina/1.jpg",
      "/images/cocina/2.jpg",
      "/images/cocina/3.jpg",
      "/images/cocina/4.jpg",
      ],
  },
  {
    id: "habitacion-principal",
    title: "Habitación principal",
    description: "Habitación principal con cama queen size, centro de entretenimiento, mini balcón y baño privado.",
    images: [
      "/images/habitaciones/1.jpg",
      "/images/habitaciones/1a.jpg",
      "/images/habitaciones/1b.jpg",
      "/images/habitaciones/1c.jpg",
    ],
  },
  {
    id: "habitacion-1",
    title: "Habitación 1",
    description: "Habitación con cama 2 plazas, guardarropa y baño compartido.",
    images: [
      "/images/habitaciones/2.jpg",
      "/images/habitaciones/2a.jpg",
      "/images/habitaciones/2b.jpg",
      "/images/habitaciones/2c.jpg",
    ],
  },
  {
    id: "habitacion-2",
    title: "Habitación 2",
    description: "Habitación con cama 2 plazas, escritorio y baño compartido.",
    images: [
      "/images/habitaciones/3.jpg",
      "/images/habitaciones/3a.jpg",
      "/images/habitaciones/3b.jpg",
      "/images/habitaciones/3c.jpg",
    ],
  },
  {
    id: "banos",
    title: "Baños",
    description: "Baños modernos con acabados de alta calidad.",
    images: [
      "/images/banos/1.jpg",
      "/images/banos/2.jpg",
      "/images/banos/3.jpg",
      "/images/banos/4.jpg",
    ],
  },
  {
    id: "lavanderia",
    title: "Lavandería",
    description: "Área de lavandería con máquina de lavar y terma a gas.",
    images: [
      "/images/lavanderia/1.jpg",
      "/images/lavanderia/2.jpg",
      "/images/lavanderia/3.jpg",
      "/images/lavanderia/4.jpg",
      "/images/lavanderia/5.jpg",
      "/images/lavanderia/6.jpg",
    ],
  },
  {
    id: "extras",
    title: "Fotos exteriores",
    description: "Vistas panorámicas del exterior del alojamiento.",
    images: [
      "/images/exteriores/1.jpg",
      "/images/exteriores/2.jpg",
      "/images/exteriores/3.jpg",
      "/images/exteriores/4.jpg",
      "/images/exteriores/5.jpg",
      "/images/exteriores/6.jpg",
      "/images/exteriores/7.jpg",
    ],
  },
];
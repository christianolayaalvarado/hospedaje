"use client";

import Image from "next/image";
import { gallerySections } from "@/lib/galleryData";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GalleryLightbox from "@/components/GalleryLightbox";

export default function TourPage() {
  const router = useRouter();

  // 🔥 LIGHTBOX
  const [openGallery, setOpenGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<{ src: string }[]>([]);

  // 🔥 REFERENCIAS
  const sectionRefs =
    useRef<Record<string, HTMLElement | null>>({});

  // 🔥 SCROLL A SECCIÓN
  function scrollToSection(id: string) {
    const navbar =
      document.getElementById("tour-navbar");

    const navbarHeight = navbar?.offsetHeight || 0;

    const section =
      sectionRefs.current[id];

    if (!section) return;

    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight -
      90;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  // 🔥 ABRIR GALERÍA
  function openGalleryModal(
    images: string[],
    index: number
  ) {
    setSlides(
      images.map((src) => ({
        src,
      }))
    );

    setCurrentIndex(index);
    setOpenGallery(true);
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ===================================================== */}
      {/* 🔝 HEADER */}
      {/* ===================================================== */}

      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b">

        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* 🔙 VOLVER */}
          <button
            onClick={() => router.push("/")}
            className="
              flex items-center gap-2
              text-gray-600 hover:text-black
              transition
            "
          >
            <span className="text-xl">←</span>

            <span className="text-sm font-medium">
              Volver
            </span>
          </button>

          {/* 🔥 TÍTULO */}
          <h1
            className="
              text-lg md:text-2xl
              font-semibold tracking-tight
              text-center
            "
          >
            Recorrido Fotográfico
          </h1>

          {/* balance */}
          <div className="w-[80px]" />

        </div>

      </div>

      {/* ===================================================== */}
      {/* 🔥 NAVBAR MINIATURAS */}
      {/* ===================================================== */}

      <div
        id="tour-navbar"
        className="
          sticky top-[73px]
          z-30
          bg-white/95
          backdrop-blur-md
          border-b
        "
      >

        <div className="max-w-6xl mx-auto relative">

          {/* SCROLL */}
          <div
            className="
              flex gap-4
              overflow-x-auto
              px-4 py-4
              snap-x snap-mandatory
              scrollbar-hide
            "
          >

            {gallerySections.map((section) => (

              <button
                key={section.id}
                onClick={() =>
                  scrollToSection(section.id)
                }
                className="
                  flex flex-col items-center
                  min-w-[110px]
                  snap-start
                  group
                "
              >

                {/* IMAGEN */}
                <div
                  className="
                    relative
                    w-28 h-20
                    rounded-xl
                    overflow-hidden
                    shadow-sm
                  "
                >

                  <Image
                    src={
                      section.images?.[0] ??
                      "/placeholder.jpg"
                    }
                    alt={section.title}
                    fill
                    sizes="112px"
                    className="
                      object-cover
                      transition duration-300
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute inset-0
                      bg-black/0
                      group-hover:bg-black/20
                      transition
                    "
                  />

                </div>

                {/* TEXTO */}
                <span
                  className="
                    text-sm mt-2
                    text-gray-500
                    group-hover:text-black
                    transition
                  "
                >
                  {section.title}
                </span>

              </button>

            ))}

          </div>

          {/* FADE */}
          <div
            className="
              pointer-events-none
              absolute right-0 top-0
              h-full w-10
              bg-gradient-to-l
              from-white to-transparent
            "
          />

        </div>

      </div>

      {/* ===================================================== */}
      {/* 🔥 CONTENIDO */}
      {/* ===================================================== */}

      <div
        className="
          max-w-6xl mx-auto
          px-4 py-12
          space-y-24
        "
      >

        {gallerySections.map((section) => (

          <section
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="
              grid grid-cols-1 md:grid-cols-4
              gap-8
              scroll-mt-48
            "
          >

            {/* ================================================= */}
            {/* 🔹 INFO */}
            {/* ================================================= */}

            <div className="md:col-span-1">

              <div className="md:sticky md:top-40 space-y-3">

                <h2
                  className="
                    text-[28px] md:text-[32px]
                    font-semibold
                    leading-tight
                  "
                >
                  {section.title}
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    leading-relaxed
                  "
                >
                  {section.description}
                </p>

              </div>

            </div>

            {/* ================================================= */}
            {/* 🔹 GALERÍA */}
            {/* ================================================= */}

            <div className="md:col-span-3">

              {section.images.length >= 5 ? (
                <>

                  {/* ================= MOBILE ================= */}

                  <div className="md:hidden space-y-2">

                    {/* PRINCIPAL */}
                    <div
                      onClick={() =>
                        openGalleryModal(
                          section.images,
                          0
                        )
                      }
                      className="
                        relative
                        h-[240px]
                        rounded-2xl
                        overflow-hidden
                        cursor-pointer
                        group
                      "
                    >

                      <Image
                        src={section.images[0]}
                        alt=""
                        fill
                        sizes="100vw"
                        className="
                          object-cover
                          transition duration-500
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          absolute inset-0
                          bg-black/10
                          group-hover:bg-black/25
                          transition
                        "
                      />

                    </div>

                    {/* MINIATURAS */}
                    <div className="grid grid-cols-2 gap-2">

                      {section.images
                        .slice(1, 5)
                        .map((img, i) => (

                          <div
                            key={i}
                            onClick={() =>
                              openGalleryModal(
                                section.images,
                                i + 1
                              )
                            }
                            className="
                              relative
                              h-[110px]
                              rounded-xl
                              overflow-hidden
                              cursor-pointer
                              group
                            "
                          >

                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="50vw"
                              className="
                                object-cover
                                transition duration-500
                                group-hover:scale-105
                              "
                            />

                            <div
                              className="
                                absolute inset-0
                                bg-black/10
                                group-hover:bg-black/25
                                transition
                              "
                            />

                          </div>

                        ))}

                    </div>

                  </div>

                  {/* ================= DESKTOP ================= */}

                  <div className="hidden md:grid grid-cols-2 gap-4">

                    {/* PRINCIPAL */}
                    <div
                      onClick={() =>
                        openGalleryModal(
                          section.images,
                          0
                        )
                      }
                      className="
                        col-span-2
                        relative
                        h-[380px]
                        rounded-2xl
                        overflow-hidden
                        cursor-pointer
                        group
                        active:scale-[0.99]
                        transition
                      "
                    >

                      <Image
                        src={section.images[0]}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 70vw"
                        className="
                          object-cover
                          transition duration-500
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          absolute inset-0
                          bg-black/0
                          group-hover:bg-black/20
                          transition
                        "
                      />

                    </div>

                    {/* SECUNDARIAS */}
                    {section.images
                      .slice(1)
                      .map((img, i) => (

                        <div
                          key={i}
                          onClick={() =>
                            openGalleryModal(
                              section.images,
                              i + 1
                            )
                          }
                          className="
                            relative
                            h-[220px]
                            rounded-2xl
                            overflow-hidden
                            cursor-pointer
                            group
                            active:scale-[0.99]
                            transition
                          "
                        >

                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="(max-width:768px) 50vw, 35vw"
                            className="
                              object-cover
                              transition duration-500
                              group-hover:scale-105
                            "
                          />

                          <div
                            className="
                              absolute inset-0
                              bg-black/0
                              group-hover:bg-black/20
                              transition
                            "
                          />

                        </div>

                      ))}

                  </div>

                </>
              ) : (

                <div className="grid grid-cols-2 gap-4">

                  {section.images.map((img, i) => (

                    <div
                      key={i}
                      onClick={() =>
                        openGalleryModal(
                          section.images,
                          i
                        )
                      }
                      className="
                        relative
                        h-[220px] md:h-[260px]
                        rounded-2xl
                        overflow-hidden
                        cursor-pointer
                        group
                        active:scale-[0.99]
                        transition
                      "
                    >

                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(max-width:768px) 50vw, 33vw"
                        className="
                          object-cover
                          transition duration-500
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          absolute inset-0
                          bg-black/0
                          group-hover:bg-black/20
                          transition
                        "
                      />

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>

        ))}

      </div>

      {/* ===================================================== */}
      {/* 🔥 LIGHTBOX */}
      {/* ===================================================== */}

      <GalleryLightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        index={currentIndex}
        slides={slides}
      />

    </div>
  );
}
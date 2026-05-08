"use client";

export default function WhatsAppButton() {

  const phone =
    "51959502168"; // 👈 tu número

  const message =
    encodeURIComponent(
      "Hola, quisiera información sobre disponibilidad y reservas."
    );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed
        bottom-24 md:bottom-6
        right-4 md:right-6
        z-50
        group
      "
    >

      {/* tooltip */}
      <div
        className="
          absolute
          right-16
          top-1/2
          -translate-y-1/2
          whitespace-nowrap
          bg-black
          text-white
          text-xs
          px-3 py-2
          rounded-full
          opacity-0
          group-hover:opacity-100
          transition
          pointer-events-none
        "
      >
        Escríbenos por WhatsApp
      </div>

      {/* botón */}
      <div
        className="
          h-14 w-14
          rounded-full
          bg-green-500
          hover:bg-green-600
          text-white
          flex
          items-center
          justify-center
          shadow-2xl
          transition-all
          duration-300
          active:scale-95
          group-hover:scale-110
          backdrop-blur-xl
          animate-bounce
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-current"
        >
          <path d="M16 .396C7.164.396 0 7.56 0 16.396c0 2.82.736 5.57 2.134 7.992L0 32l7.836-2.052a15.91 15.91 0 0 0 8.164 2.248c8.836 0 16-7.164 16-16S24.836.396 16 .396zm0 29.08a13.01 13.01 0 0 1-6.636-1.82l-.476-.284-4.648 1.216 1.24-4.528-.312-.464A13.004 13.004 0 1 1 16 29.476zm7.148-9.74c-.392-.196-2.32-1.144-2.68-1.276-.36-.132-.624-.196-.888.196-.264.392-1.02 1.276-1.252 1.54-.228.264-.46.296-.852.1-.392-.196-1.656-.612-3.156-1.948-1.164-1.036-1.948-2.316-2.176-2.708-.228-.392-.024-.604.172-.8.176-.176.392-.46.588-.688.196-.228.264-.392.392-.656.132-.264.064-.492-.032-.688-.1-.196-.888-2.14-1.216-2.932-.32-.772-.648-.668-.888-.68l-.756-.012c-.264 0-.688.1-1.048.492-.36.392-1.376 1.344-1.376 3.276 0 1.932 1.408 3.8 1.604 4.064.196.264 2.772 4.236 6.716 5.94.94.404 1.672.644 2.244.824.944.3 1.804.256 2.484.156.76-.112 2.32-.948 2.648-1.864.328-.916.328-1.7.228-1.864-.096-.164-.36-.264-.752-.46z"/>
        </svg>

      </div>

    </a>
  );
}
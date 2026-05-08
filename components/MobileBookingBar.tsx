"use client";

type Props = {
  price: number;
  startDate: Date | null;
  endDate: Date | null;
  onOpen: () => void;
};

export default function MobileBookingBar({
  price,
  startDate,
  endDate,
  onOpen,
}: Props) {

  return (
    <div
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        z-40
        border-t
        bg-white/90
        backdrop-blur-xl
        px-4
        py-3
        pb-[calc(env(safe-area-inset-bottom)+12px)]
        shadow-[0_-5px_30px_rgba(0,0,0,0.08)]
      "
    >

      <div className="flex items-center justify-between gap-4">

        {/* 💰 INFO */}
        <div>

          <p className="font-semibold leading-none">
            S/ {price}
            <span className="text-sm text-gray-500 font-normal">
              {" "}noche
            </span>
          </p>

          <p className="text-xs text-gray-500 mt-1">

            {startDate && endDate
              ? `${startDate.toLocaleDateString("es-PE")} - ${endDate.toLocaleDateString("es-PE")}`
              : "Selecciona fechas"}

          </p>

        </div>

        {/* 🔘 CTA */}
        <button
          onClick={onOpen}
          className="
            bg-rose-500
            hover:bg-rose-600
            active:scale-95
            transition
            text-white
            px-6
            py-3
            rounded-xl
            font-medium
            shadow-md
            whitespace-nowrap
          "
        >
          Reservar
        </button>

      </div>

    </div>
  );
}
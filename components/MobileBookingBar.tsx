"use client";

type Props = {
  price: number;

  startDate: Date | null;
  endDate: Date | null;

  nights: number;

  loading?: boolean;

  onOpen: () => void;

  onReserve: () => void;
};

export default function MobileBookingBar({
  price,
  startDate,
  endDate,
  nights,
  loading,
  onOpen,
  onReserve,
}: Props) {

  const hasDates =
    startDate && endDate;

  return (

    <div
      className="
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-40
        border-t
        bg-white
        px-4
        py-3
        shadow-[0_-4px_20px_rgba(0,0,0,.08)]
        backdrop-blur-xl
      "
    >

      <div className="flex items-center justify-between gap-4">

        {/* LEFT */}
        <div
          onClick={onOpen}
          className="flex-1 min-w-0 cursor-pointer"
        >

          <div className="font-semibold text-lg leading-none">
            S/ {price}
          </div>

          <div className="text-xs text-gray-500 mt-1 truncate">

            {hasDates
              ? `${nights} noche${nights > 1 ? "s" : ""}`
              : "Selecciona fechas"}

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={hasDates ? onReserve : onOpen}
          disabled={loading}
          className="
            bg-rose-500
            hover:bg-rose-600
            active:scale-[.98]
            transition
            text-white
            px-6
            py-3
            rounded-2xl
            font-medium
            shadow-lg
            disabled:opacity-50
          "
        >

          {loading
            ? "Procesando..."
            : hasDates
              ? "Reservar"
              : "Fechas"}

        </button>

      </div>

    </div>

  );

}
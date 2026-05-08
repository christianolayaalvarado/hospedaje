"use client";

import {
  DayPicker,
  DateRange,
} from "react-day-picker";

import "react-day-picker/dist/style.css";

import {
  useState,
  useEffect,
} from "react";

import { es } from "date-fns/locale";

import "./calendar.css";

type Props = {
  onChange: (
    range: {
      from?: Date;
      to?: Date;
    }
  ) => void;

  getPrecioPorDia: (
    date: Date
  ) => number;
};

export default function CalendarAirbnb({
  onChange,
}: Props) {

  // =========================================================
  // 📅 RANGE
  // =========================================================

  const [range, setRange] =
    useState<DateRange | undefined>();

  // =========================================================
  // 🔥 HOVER PREVIEW
  // =========================================================

  const [hoveredDate, setHoveredDate] =
    useState<Date | undefined>();

  // =========================================================
  // 📱 MOBILE DETECTION
  // =========================================================

  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {

    function handleResize() {

      setIsMobile(
        window.innerWidth < 768
      );

    }

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);

  // =========================================================
  // 🔥 SELECT
  // =========================================================

  function handleSelect(
    r: DateRange | undefined
  ) {

    setRange(r);

    // 🔥 limpia preview al completar rango
    if (r?.from && r?.to) {
      setHoveredDate(undefined);
    }

    if (r?.from) {

      onChange({
        from: r.from,
        to: r.to,
      });

    }

  }

  // =========================================================
  // 🔥 PREVIEW RANGE TIPO AIRBNB
  // =========================================================

  const previewRange =
    range?.from &&
    hoveredDate &&
    !range?.to
      ? {
          from:
            hoveredDate < range.from
              ? hoveredDate
              : range.from,

          to:
            hoveredDate > range.from
              ? hoveredDate
              : range.from,
        }
      : undefined;

  return (

    <div className="bg-white w-full overflow-hidden">

      <DayPicker

        locale={es}

        mode="range"

        // 🔥 MOBILE = 1 MES
        // 🔥 DESKTOP = 2 MESES
        numberOfMonths={
          isMobile ? 1 : 2
        }

        selected={range}

        onSelect={handleSelect}

        // 🔥 hover preview
        onDayMouseEnter={(date) => {

          if (
            range?.from &&
            !range?.to
          ) {
            setHoveredDate(date);
          }

        }}

        modifiers={{
          preview: previewRange,
        }}

        modifiersClassNames={{

          range_start:
            "rdp-range_start",

          range_end:
            "rdp-range_end",

          range_middle:
            "rdp-range_middle",

          preview:
            "rdp-preview",

          today:
            "border border-black",
        }}

        classNames={{

          // =========================================================
          // 🔥 MESES RESPONSIVE
          // =========================================================

          months:
            `
            flex
            flex-col
            md:flex-row
            gap-8
            md:gap-10
            justify-center
          `,

          month:
            "space-y-4 w-full",

          // =========================================================
          // 🔥 HEADER MES
          // =========================================================

          caption:
            `
            relative
            flex
            items-center
            justify-center
            py-4
          `,

          caption_label:
            `
            text-sm
            md:text-base
            font-semibold
          `,

          // =========================================================
          // 🔥 FLECHAS MÁS ABAJO Y CENTRADAS
          // =========================================================

          nav:
            `
            absolute
            inset-x-0
            top-10
            flex
            items-center
            justify-between
            px-2
          `,

          nav_button:
            `
            h-8
            w-8
            flex
            items-center
            justify-center
            rounded-full
            hover:bg-gray-100
            transition
          `,

          // =========================================================
          // 🔥 TABLA
          // =========================================================

          table:
            `
            w-full
            border-collapse
          `,

          head_row:
            `
            flex
            w-full
          `,

          head_cell:
            `
            flex-1
            text-center
            text-[11px]
            md:text-xs
            font-medium
            text-gray-500
          `,

          row:
            `
            flex
            w-full
            mt-2
          `,

          cell:
            `
            flex-1
            text-center
            relative
            p-0
            text-sm
            focus-within:relative
            focus-within:z-20
          `,

          // =========================================================
          // 🔥 DÍAS
          // =========================================================

          day:
            `
            calendar-day
          `,

          // =========================================================
          // 🔥 BOTONES DÍA
          // =========================================================

          day_button:
            `
            h-9
            w-9
            md:h-10
            md:w-10

            mx-auto

            rounded-full

            transition-all
            duration-200

            font-normal

            relative
            z-20

            flex
            items-center
            justify-center

            text-sm
          `,

          month_grid:
            "w-full",
        }}

        formatters={{

          formatDay: (date) => {

            return date
              .getDate()
              .toString();

          },

        }}
      />

    </div>

  );
}
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
  getPrecioPorDia,
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
            items-start
          `,

          month:
            `
            space-y-4
            w-full
            min-w-0
          `,

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
            px-10
          `,

          caption_label:
            `
            text-sm
            md:text-base
            font-semibold
          `,

          // =========================================================
          // 🔥 FLECHAS
          // =========================================================

          nav:
            `
            absolute
            inset-x-0
            top-5
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
            w-12
            md:w-14

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
            w-12
            md:w-14

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
            h-12
            w-12

            md:h-14
            md:w-14

            mx-auto

            rounded-full

            transition-all
            duration-200

            font-normal

            relative
            z-20

            flex
            flex-col
            items-center
            justify-center

            text-sm
          `,

          month_grid:
            "w-full",
        }}

        components={{
          DayContent: ({ date }) => {

            const precio =
              getPrecioPorDia(date);

            return (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  leading-none
                "
              >

                <span className="text-[13px] md:text-sm">
                  {date.getDate()}
                </span>

                <span
                  className="
                    text-[9px]
                    md:text-[10px]
                    text-gray-500
                    mt-1
                  "
                >
                  S/{precio}
                </span>

              </div>

            );
          },
        }}
      />

    </div>

  );
}
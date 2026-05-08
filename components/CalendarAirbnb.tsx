"use client";

import {
  DayPicker,
  DateRange,
} from "react-day-picker";

import "react-day-picker/dist/style.css";
import { useState } from "react";

import "./calendar.css";

type Props = {
  onChange: (range: { from?: Date; to?: Date }) => void;
  getPrecioPorDia: (date: Date) => number;
};

export default function CalendarAirbnb({
  onChange,
}: Props) {

  const [range, setRange] =
    useState<DateRange | undefined>();

  const [hoveredDate, setHoveredDate] =
    useState<Date | undefined>();

  function handleSelect(r: DateRange | undefined) {

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

  // 🔥 preview dinámico tipo Airbnb
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
    <div className="bg-white w-full">

      <DayPicker
        mode="range"

        // 🔥 MOBILE = 1 mes | DESKTOP = 2 meses
        numberOfMonths={
          typeof window !== "undefined" &&
          window.innerWidth < 768
            ? 1
            : 2
        }

        selected={range}

        onSelect={handleSelect}

        // 🔥 hover preview
        onDayMouseEnter={(date) => {

          if (range?.from && !range?.to) {
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

          // 🔥 meses responsive
          months:
            "flex flex-col md:flex-row gap-6 md:gap-10 justify-center",

          month:
            "space-y-4 w-full",

          // 🔥 header mes
          caption:
            "relative flex items-center justify-center pb-4 pt-2",

          caption_label:
            "text-sm md:text-base font-semibold",

          // 🔥 flechas mejor alineadas
          nav:
            "absolute inset-x-0 top-1 flex items-center justify-between px-1",

          nav_button:
            `
              h-8 w-8
              flex items-center justify-center
              rounded-full
              hover:bg-gray-100
              transition
            `,

          // 🔥 tabla
          table:
            "w-full border-collapse",

          head_row:
            "flex justify-between",

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
            "flex w-full mt-2 justify-between",

          cell:
            `
              relative
              flex-1
              p-0
              text-center
              text-sm
              focus-within:relative
              focus-within:z-20
            `,

          // 🔥 hover UX
          day:
            "calendar-day flex items-center justify-center",

          // 🔥 tamaño responsive
          day_button:
            `
              h-10 w-10
              md:h-11 md:w-11
              rounded-full
              transition-all
              duration-200
              font-normal
              relative
              z-20
              flex items-center justify-center
              mx-auto
              text-sm
            `,

          month_grid:
            "w-full",
        }}

        formatters={{

          formatDay: (date) => {
            return date.getDate().toString();
          },

        }}
      />

    </div>
  );
}
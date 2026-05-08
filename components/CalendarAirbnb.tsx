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

  const [range, setRange] = useState<DateRange | undefined>();

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
    <div className="bg-white">
      <DayPicker

        mode="range"

        numberOfMonths={2}

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

          months:
            "flex flex-col md:flex-row gap-10 justify-center",

          month:
            "space-y-4",

          caption:
            "relative flex items-center justify-center pt-1 pb-4 text-base font-semibold",

          caption_label:
            "text-base font-semibold",

          nav:
            "absolute inset-x-0 top-0 flex items-center justify-between",

          nav_button:
            "h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition",

          table:
            "w-full border-collapse",

          head_row:
            "flex",

          head_cell:
            "w-10 text-xs font-medium text-gray-500",

          row:
            "flex w-full mt-2",

          cell:
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",

          // 🔥 necesario para hover UX
          day:
            "calendar-day",

          day_button:
            "h-10 w-10 rounded-full transition-all duration-200 font-normal relative z-20 flex items-center justify-center",

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
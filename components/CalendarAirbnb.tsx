"use client";

import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";

type Props = {
  onChange: (range: { from?: Date; to?: Date }) => void;
  getPrecioPorDia: (date: Date) => number;
};

export default function CalendarAirbnb({
  onChange,
  getPrecioPorDia,
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>();

  function handleSelect(r: DateRange | undefined) {
    setRange(r);

    if (r?.from) {
      onChange({
        from: r.from,
        to: r.to,
      });
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        modifiersClassNames={{
  selected:
    "bg-black text-white font-medium",

  range_start:
    "bg-black text-white rounded-l-full font-medium",

  range_end:
    "bg-black text-white rounded-r-full font-medium",

  range_middle:
    "bg-gray-300 text-black",

  today:
    "border border-black font-semibold",
        }}
  classNames={{
  day: "h-11 w-11 text-sm rounded-full transition-colors",
  day_button:
    "h-11 w-11 rounded-full hover:bg-gray-200 transition",
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
"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
    onChange(r || {});
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        components={{
          Day: ({ day }) => {
            const date = day.date;
            const precio = getPrecioPorDia(date);

            return (
              <div className="flex flex-col items-center justify-center text-xs h-full">
                <span>{date.getDate()}</span>
                <span className="text-[10px] text-gray-500">
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
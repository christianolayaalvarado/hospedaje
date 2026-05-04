"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CalendarAirbnb({
  onChange,
  getPrecioPorDia,
}: {
  onChange: (range: { from?: Date; to?: Date }) => void;
  getPrecioPorDia: (date: Date) => number;
}) {
  const [range, setRange] = useState<DateRange | undefined>();

  function handleSelect(r: DateRange | undefined) {
    setRange(r);
    onChange(r || {});
  }

  return (
    <div className="bg-white p-4 rounded-xl w-full">

      {/* HEADER */}
      <div className="flex justify-between mb-3 text-sm">
        <div>
          <div className="font-semibold">
            {range?.from
              ? format(range.from, "dd MMM yyyy", { locale: es })
              : "Fecha inicio"}
          </div>
        </div>

        <div>
          <div className="font-semibold">
            {range?.to
              ? format(range.to, "dd MMM yyyy", { locale: es })
              : "Fecha fin"}
          </div>
        </div>
      </div>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        locale={es}
        disabled={{ before: new Date() }}

        components={{
          DayContent: ({ date }) => {
            const precio = getPrecioPorDia(date);

            return (
              <div className="flex flex-col items-center text-xs">
                <span>{date.getDate()}</span>
                <span className="text-[10px] text-gray-500">
                  S/ {precio}
                </span>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
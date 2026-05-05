"use client";

import { DayPicker } from "react-day-picker";
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
  const [range, setRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  function handleSelect(r: any) {
    setRange(r);
    onChange(r);
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        modifiersClassNames={{
          selected: "bg-black text-white",
          range_start: "bg-black text-white",
          range_end: "bg-black text-white",
        }}
        components={{
          DayContent: (props) => {
            const date = props.date;
            const precio = getPrecioPorDia(date);

            return (
              <div className="flex flex-col items-center justify-center text-xs h-full">
                <span>{date.getDate()}</span>
                <span className="text-[10px] opacity-70">
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
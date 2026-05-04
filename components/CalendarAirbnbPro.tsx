"use client";

import { useState } from "react";
import { addMonths, format, isSameDay } from "date-fns";

type Props = {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (range: { from?: Date | null; to?: Date | null }) => void;
  onSelectRange?: (start: Date, end: Date) => void;
  pricePerNight?: number;
};

export default function CalendarAirbnb({
  startDate = null,
  endDate = null,
  onChange,
  onSelectRange,
  pricePerNight = 180,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null;
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i - firstDay + 1
    );
  });

  function handleSelect(date: Date) {
    let nextStart = tempStart;
    let nextEnd = tempEnd;

    if (!tempStart || (tempStart && tempEnd)) {
      nextStart = date;
      nextEnd = null;
      setTempStart(date);
      setTempEnd(null);
      onChange?.({ from: date, to: null });
      return;
    }

    if (date < tempStart) {
      nextStart = date;
      nextEnd = tempStart;
    } else {
      nextStart = tempStart;
      nextEnd = date;
    }

    setTempStart(nextStart);
    setTempEnd(nextEnd);

    if (nextStart && nextEnd) {
      onChange?.({ from: nextStart, to: nextEnd });
      onSelectRange?.(nextStart, nextEnd);
    }
  }

  function getPrice(date: Date) {
    const day = date.getDay();
    const isWeekend = day === 5 || day === 6 || day === 0;
    return isWeekend ? pricePerNight + 40 : pricePerNight;
  }

  function inRange(date: Date) {
    if (!tempStart || !tempEnd) return false;
    return date >= tempStart && date <= tempEnd;
  }

  return (
    <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          ‹
        </button>

        <div className="font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </div>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2">
        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          if (!day) {
            return <div key={i} />;
          }

          const selected =
            (tempStart && isSameDay(day, tempStart)) ||
            (tempEnd && isSameDay(day, tempEnd));

          return (
            <button
              key={i}
              onClick={() => handleSelect(day)}
              className={[
                "h-14 rounded-xl text-sm flex flex-col items-center justify-center transition",
                "hover:bg-gray-100",
                inRange(day) ? "bg-gray-200" : "",
                selected ? "bg-black text-white hover:bg-black" : "",
              ].join(" ")}
            >
              <span>{day.getDate()}</span>
              <span className="text-[10px] opacity-70">
                S/ {getPrice(day)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useState, useEffect } from "react";
import { es } from "date-fns/locale";
import "./calendar.css";

const MIN_NIGHTS = 2;

type Props = {
  selectedRange: DateRange | undefined;
  onChange: (selectedRange: { from?: Date; to?: Date }) => void;
  getPrecioPorDia: (date: Date) => number;
};

type BookedRange = {
  from: Date;
  to: Date;
};

export default function CalendarAirbnb({
  selectedRange,
  onChange,
}: Props) {
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();
  const [isMobile, setIsMobile] = useState(false);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  // RESPONSIVE
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // BOOKINGS
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        if (!Array.isArray(data)) return;

        setBookedRanges(
          data.map((b: any) => ({
            from: new Date(b.startDate),
            to: new Date(b.endDate),
          }))
        );
      } catch (e) {
        console.error(e);
      }
    }

    fetchBookings();
  }, []);

  function isDayBlocked(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return bookedRanges.some((r) => {
      const from = new Date(r.from);
      const to = new Date(r.to);

      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);

      return d >= from && d <= to;
    });
  }

  function handleSelect(r: DateRange | undefined) {
    if (!r) {
      onChange({ from: undefined, to: undefined });
      return;
    }

    if (r.from && r.to && r.from.getTime() === r.to.getTime()) {
      onChange({ from: r.from, to: undefined });
      return;
    }

    if (r.from && r.to) {
      const nights = Math.ceil(
        (r.to.getTime() - r.from.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (nights < MIN_NIGHTS) return;

      setHoveredDate(undefined);
      onChange({ from: r.from, to: r.to });
    }
  }

  const previewRange =
    selectedRange?.from && hoveredDate && !selectedRange?.to
      ? {
          from:
            hoveredDate < selectedRange.from
              ? hoveredDate
              : selectedRange.from,
          to:
            hoveredDate > selectedRange.from
              ? hoveredDate
              : selectedRange.from,
        }
      : undefined;

  return (
    <div className="bg-white w-full">

      {/* LEYENDA */}
      <div className="flex gap-4 text-xs px-4 pb-2">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-300 rounded-full" />
          No disponible
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-black rounded-full" />
          Disponible
        </span>
      </div>

      <DayPicker
        locale={es}
        mode="range"
        numberOfMonths={isMobile ? 1 : 2}
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={isDayBlocked}
        onDayMouseEnter={(date) => {
          if (selectedRange?.from && !selectedRange?.to) {
            setHoveredDate(date);
          }
        }}
        modifiers={{
          preview: previewRange,
          booked: (date) => isDayBlocked(date),
        }}
        modifiersClassNames={{
          range_start: "rdp-range_start",
          range_end: "rdp-range_end",
          range_middle: "rdp-range_middle",
          preview: "rdp-preview",
          booked: "rdp-blocked",
        }}
classNames={{
  months:
    "flex flex-col md:flex-row gap-6 justify-center items-start px-2 pb-6",

  month: "space-y-4 w-full",

  month_grid: "w-full border-collapse",

  weekdays: "grid grid-cols-7 mb-2",

  weekday:
    "text-gray-500 font-medium text-sm flex items-center justify-center",

  week: "grid grid-cols-7",

  day: "flex items-center justify-center p-0",

  day_button:
    "h-10 w-10 rounded-full flex items-center justify-center text-sm transition hover:bg-gray-100",

  caption:
    "flex items-center justify-center py-3 font-semibold relative text-3xl",

  nav:
    "absolute top-10 left-0 right-0 w-full flex justify-between px-4",

  nav_button_previous:
    "hover:bg-gray-100 rounded-full p-2 mt-1",

  nav_button_next:
    "hover:bg-gray-100 rounded-full p-2 mt-1",

  disabled:
    "text-gray-300 line-through opacity-40 cursor-not-allowed",

  today:
    "border border-black rounded-full",
}}
          components={{
        DayButton: (props) => {

          const blocked =
            isDayBlocked(props.day.date);

          return (
            <button
              {...props}
              title={
                blocked
                  ? "Fecha no disponible"
                  : "Disponible"
              }
            />
          );
        },
      }}
        
      />
    </div>
  );
}
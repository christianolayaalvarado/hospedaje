"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from "date-fns/locale";
import "./calendar.css";

type Props = {
  selectedRange: DateRange | undefined;
  onChange: (range: { from?: Date; to?: Date }) => void;
  propertyId?: string;
};

type BookedRange = {
  from: Date;
  to: Date;
};

const normalize = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function CalendarAirbnb({
  selectedRange,
  onChange,
  propertyId,
}: Props) {
  const [hovered, setHovered] = useState<Date | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  // =========================
  // FETCH BOOKINGS (FILTERED)
  // =========================
  useEffect(() => {
    async function load() {
      try {
        const url = propertyId
          ? `/api/bookings?propertyId=${propertyId}`
          : "/api/bookings";

        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        setBookedRanges(
          data.map((b: any) => ({
            from: normalize(new Date(b.startDate)),
            to: normalize(new Date(b.endDate)),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [propertyId]);

  // =========================
  // BLOCKED DAYS
  // =========================
  const isBlocked = (date: Date) => {
    const d = normalize(date);

    return bookedRanges.some((r) => d >= r.from && d <= r.to);
  };

  // =========================
  // HANDLE SELECT (PURE STATE)
  // =========================
  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange({ from: undefined, to: undefined });
      return;
    }

    const from = range.from ? normalize(range.from) : undefined;
    const to = range.to ? normalize(range.to) : undefined;

    if (from && to && to < from) return;

    onChange({ from, to });
  };

  // =========================
  // PREVIEW RANGE (AIRBNB UX)
  // =========================
  const previewRange = useMemo(() => {
    if (!selectedRange?.from || selectedRange?.to || !hovered) return undefined;

    return {
      from:
        hovered < selectedRange.from ? hovered : selectedRange.from,
      to:
        hovered > selectedRange.from ? hovered : selectedRange.from,
    };
  }, [hovered, selectedRange]);

  return (
    <div className="bg-white w-full">
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
        numberOfMonths={2}
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={isBlocked}
        onDayMouseEnter={(day) => setHovered(day)}
        modifiers={{
          preview: previewRange,
          booked: isBlocked,
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
          weekdays: "grid grid-cols-7 mb-2",
          weekday:
            "text-gray-500 font-medium text-sm flex justify-center",
          week: "grid grid-cols-7",
          day: "flex justify-center",
          day_button:
            "h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition",
          nav: "flex justify-between px-2",
        }}
      />
    </div>
  );
}
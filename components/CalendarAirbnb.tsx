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

const MIN_NIGHTS = 2;

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

type BookedRange = {
  from: Date;
  to: Date;
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

  // =========================================================
  // 🔒 BOOKED RANGES
  // =========================================================

  const [bookedRanges, setBookedRanges] =
    useState<BookedRange[]>([]);

  // =========================================================
  // 📱 RESPONSIVE
  // =========================================================

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

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  // =========================================================
  // 🔥 FETCH BOOKINGS
  // =========================================================

  useEffect(() => {

    async function fetchBookings() {

      try {

        const res =
          await fetch("/api/bookings");

        const data = await res.json();

        const ranges =
          data.map(
            (booking: any) => ({
              from: new Date(
                booking.startDate
              ),

              to: new Date(
                booking.endDate
              ),
            })
          );

        setBookedRanges(ranges);

      } catch (error) {

        console.error(
          "Error fetching bookings",
          error
        );

      }
    }

    fetchBookings();

  }, []);

  // =========================================================
  // 🔥 SELECT RANGE
  // =========================================================

  function handleSelect(
    r: DateRange | undefined
  ) {

    // =========================================================
    // 🔥 VALIDACIÓN
    // =========================================================

    if (r?.from && r?.to) {

      const nights = Math.ceil(
        (
          r.to.getTime() -
          r.from.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      );

      // mínimo de noches
      if (nights < MIN_NIGHTS) {

        alert(
          `La estadía mínima es de ${MIN_NIGHTS} noches`
        );

        return;
      }
    }

    setRange(r);

    // limpia hover
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
  // 🔥 PREVIEW RANGE AIRBNB STYLE
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

        numberOfMonths={
          isMobile ? 1 : 2
        }

        selected={range}

        onSelect={handleSelect}

        disabled={bookedRanges}

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

          table:
            "w-full border-collapse",

          head_row:
            "flex w-full",

          head_cell:
            `
            w-19
            md:w-10
            text-center
            text-[11px]
            md:text-xs
            font-medium
            text-gray-500
          `,

          row:
            "flex w-full mt-2",

          cell:
            `
            w-9
            md:w-10
            text-center
            relative
            p-0
            text-sm
            focus-within:relative
            focus-within:z-20
          `,

          day:
            "calendar-day",

          day_button:
            `
            h-9 w-9
            md:h-10 md:w-10
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

        // =========================================================
        // 🔥 CUSTOM DAY
        // =========================================================

        components={{

          DayButton: ({
            day,
            children,
            ...buttonProps
          }: any) => {

            const date: Date = day.date;

            const precio =
              getPrecioPorDia(date);

            return (

              <div className="group relative">

                <button
                  {...buttonProps}
                  type="button"
                >

                  {/* número */}
                  <div>
                    {children}
                  </div>

                  {/* precio */}
                  <div
                    className="
                      text-[8px]
                      md:text-[9px]
                      text-gray-500
                      leading-none
                      mt-[2px]
                    "
                  >
                    S/{precio}
                  </div>

                </button>

                {/* tooltip */}
                <div
                  className="
                    absolute
                    bottom-full
                    left-1/2
                    -translate-x-1/2

                    mb-2

                    bg-black
                    text-white

                    text-[10px]

                    px-2
                    py-1

                    rounded-lg

                    whitespace-nowrap

                    opacity-0
                    group-hover:opacity-100

                    pointer-events-none

                    transition

                    z-50
                  "
                >
                  S/{precio} por noche
                </div>

              </div>
            );
          },
        }}
      />
    </div>
  );
}
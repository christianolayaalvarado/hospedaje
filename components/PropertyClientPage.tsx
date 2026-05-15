"use client";

import { useState } from "react";

import BookingSidebar from "@/components/BookingSidebar";

export default function PropertyClientPage({
  property,
}: {
  property: any;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CONTENIDO */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {property.title}
            </h1>

            <p className="text-gray-500 mt-2">
              {property.location}
            </p>
          </div>

          {property.description && (
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          )}
        </div>

        {/* SIDEBAR */}
        <BookingSidebar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          propertyId={property.id}
        />
      </div>
    </div>
  );
}
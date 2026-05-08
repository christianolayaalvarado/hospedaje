"use client";

const reviews = [
  {
    name: "Camila",
    country: "Chile",
    date: "Marzo 2026",
    rating: 5,
    comment:
      "Excelente lugar. Muy limpio, cómodo y cerca de todo. La atención fue muy buena.",
  },

  {
    name: "Luis",
    country: "Perú",
    date: "Febrero 2026",
    rating: 5,
    comment:
      "El departamento es moderno y tranquilo. Muy buena ubicación en San Miguel.",
  },

  {
    name: "Andrea",
    country: "Colombia",
    date: "Enero 2026",
    rating: 4,
    comment:
      "Muy acogedor y seguro. Ideal para familias o viajes cortos.",
  },

  {
    name: "Michael",
    country: "USA",
    date: "Diciembre 2025",
    rating: 5,
    comment:
      "Beautiful apartment and excellent communication. Highly recommended.",
  },
];

export default function ReviewsSection() {

  const avg =
    reviews.reduce((acc, r) => acc + r.rating, 0) /
    reviews.length;

  return (
    <div className="space-y-8 border-t pt-8">

      {/* HEADER */}
      <div className="flex items-center gap-2">

        <span className="text-2xl">
          ⭐
        </span>

        <h2 className="text-2xl font-semibold">
          {avg.toFixed(1)} · {reviews.length} reseñas
        </h2>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {reviews.map((review, i) => (

          <div
            key={i}
            className="
              border rounded-2xl p-5
              hover:shadow-md
              transition
              bg-white
            "
          >

            {/* TOP */}
            <div className="flex items-center gap-4">

              {/* AVATAR */}
              <div
                className="
                  h-12 w-12 rounded-full
                  bg-gray-200
                  flex items-center justify-center
                  font-semibold
                "
              >
                {review.name.charAt(0)}
              </div>

              {/* INFO */}
              <div>

                <h3 className="font-medium">
                  {review.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {review.country}
                </p>

              </div>

            </div>

            {/* STARS */}
            <div className="flex gap-1 mt-4">

              {Array.from({
                length: review.rating,
              }).map((_, idx) => (
                <span key={idx}>
                  ⭐
                </span>
              ))}

            </div>

            {/* DATE */}
            <p className="text-sm text-gray-400 mt-2">
              {review.date}
            </p>

            {/* COMMENT */}
            <p className="text-gray-700 mt-4 leading-relaxed">
              {review.comment}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
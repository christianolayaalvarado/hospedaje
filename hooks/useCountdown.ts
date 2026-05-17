import { useEffect, useState } from "react";

export function useCountdown(
  expiresAt?: Date | string | null
) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft("");
      return;
    }

    const target = new Date(expiresAt).getTime();

    const update = () => {
      const now = Date.now();

      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Expirada");
        return;
      }

      const hours = Math.floor(diff / 1000 / 60 / 60);

      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );

      const seconds = Math.floor(
        (diff % (1000 * 60)) / 1000
      );

      setTimeLeft(
        `${hours
          .toString()
          .padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}

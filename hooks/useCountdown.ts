import { useEffect, useState } from "react";

export function useCountdown(expiresAt?: Date | string | null) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Expirada");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}
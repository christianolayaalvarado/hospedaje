export function getPrecioPorDia(date: Date): number {

  const day = date.getDay();
  const month = date.getMonth();

  let basePrice = 120;

  // =========================================================
  // 🔥 FINES DE SEMANA
  // =========================================================

  if (day === 5 || day === 6) {
    basePrice += 40;
  }

  // =========================================================
  // ☀️ TEMPORADA ALTA
  // =========================================================

  if ([0, 6, 11].includes(month)) {
    basePrice += 60;
  }

  // =========================================================
  // 🎉 FERIADOS / FECHAS ESPECIALES
  // =========================================================

  const dayOfMonth = date.getDate();

  if (month === 11 && dayOfMonth >= 24) {
    basePrice += 80;
  }

  return basePrice;
}
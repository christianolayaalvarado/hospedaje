export function getPrecioPorDia(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6 ? 180 : 150;
}
import { BookingStatus } from "@prisma/client";

export function getStatusStyles(status: BookingStatus) {
  switch (status) {
    case BookingStatus.APPROVED:
      return "bg-green-100 text-green-700";
    case BookingStatus.REJECTED:
      return "bg-red-100 text-red-700";
    case BookingStatus.PAYMENT_REVIEW:
      return "bg-blue-100 text-blue-700";
    case BookingStatus.CANCELLED:
      return "bg-gray-200 text-gray-700";
    case BookingStatus.EXPIRED:
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export function getStatusText(status: BookingStatus) {
  switch (status) {
    case BookingStatus.APPROVED:
      return "Aprobada";
    case BookingStatus.REJECTED:
      return "Rechazada";
    case BookingStatus.PAYMENT_REVIEW:
      return "En revisión";
    case BookingStatus.CANCELLED:
      return "Cancelada";
    case BookingStatus.EXPIRED:
      return "Expirada";
    default:
      return "Pendiente";
  }
}
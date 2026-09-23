// Backed by the Spring Boot API in /backend (see its README for setup).
// Falls back to "" (bookings saved to the browser's localStorage only) when
// NEXT_PUBLIC_API_URL isn't set, so the frontend still works standalone.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const BOOKING_ENDPOINT = API_URL ? `${API_URL}/api/rezervari` : "";
export const SLOTS_ENDPOINT = API_URL ? `${API_URL}/api/rezervari` : "";
export const SUPPORT_PHONE = "40746478853";

const PHONE_PATTERN = /^(\+?4)?0?7\d{2}[ .-]?\d{3}[ .-]?\d{3}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.replace(/\s/g, ""));
}

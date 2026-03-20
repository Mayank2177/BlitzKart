// Delivery fee logic
// Normal: orders < ₹100 pay ₹25 delivery, ≥ ₹100 is free
// Navratri event (until March 27, 2026): free delivery on ALL orders

const NAVRATRI_END = new Date("2026-03-27T23:59:59");
const DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 100;

export function isNavratriActive(): boolean {
  return new Date() <= NAVRATRI_END;
}

export function getDeliveryFee(totalPrice: number): number {
  if (isNavratriActive()) return 0;
  return totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function getDeliveryMessage(totalPrice: number): string | null {
  if (isNavratriActive()) {
    return "🪔 Navratri Special: Free delivery on all orders!";
  }
  if (totalPrice < FREE_DELIVERY_THRESHOLD) {
    const remaining = FREE_DELIVERY_THRESHOLD - totalPrice;
    return `Add ₹${remaining} more for free delivery`;
  }
  return null;
}

// Prices shown to members, in euros. Charged amounts live in membership.functions.ts (cents).
export const BOOKING_URL = "https://signecoach.com/private-coaching/";

// Create a matching coupon in WooCommerce, then set VITE_MEMBER_COUPON_CODE so members see it.
export const MEMBER_COUPON_CODE: string = import.meta.env.VITE_MEMBER_COUPON_CODE ?? "";

// Flip on with VITE_FOUNDING_OFFER=true while the founding offer (first 100 members) is open.
export const FOUNDING_OPEN = import.meta.env.VITE_FOUNDING_OFFER === "true";

export const MEMBER_DISCOUNT_PERCENT = 15;

export const WORK_WITH_SIGNE = [
  {
    name: "Deep Reset",
    price: 400,
    length: "30 days",
    blurb: "One clear pattern. A focus call, one private RTT session, a personalised recording for daily listening and 30 days of follow-up.",
    discount: true,
  },
  {
    name: "Inner Reset, 3 months",
    price: 1500,
    length: "3 sessions",
    blurb: "For the pattern you understand but keep repeating, with time to bring everyday situations into your sessions.",
    discount: false,
  },
  {
    name: "Inner Reset, 6 months",
    price: 2700,
    length: "6 sessions",
    blurb: "Steady support while you make a change in career, relationships or direction.",
    discount: false,
  },
  {
    name: "Inner Reset, 12 months",
    price: 4800,
    length: "12 sessions",
    blurb: "A longer space to work on how you see yourself and the choices you make.",
    discount: false,
  },
];

export const memberPrice = (price: number) => Math.round(price * (1 - MEMBER_DISCOUNT_PERCENT / 100));

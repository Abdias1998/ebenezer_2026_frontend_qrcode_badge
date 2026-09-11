export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const PICKUP_LOCATIONS = [

  // Cotonou
  "Centre La Grâce Parle Jericho",
  "Stade Mathieu Kérékou",
  "CEG Godomey",
  "Carrefour Cococodji",
  "Porto Novo"
] as const;

export const JDJ_EVENT_NAME = "Jeûne des Jeunes";

export const JDJ_REGISTRATION_FEE = 7000;

export const PAYMENT_NETWORKS = [
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "moov", label: "Moov Money" },
  { value: "celtiis_bj", label: "Celtiis Cash" },
] as const;
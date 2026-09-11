export type Gender = "male" | "female";

export interface RegistrationFormData {
  // Personal
  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  whatsapp: string;
  email: string;
  photo?: File | null;

  // Terms
  acceptTerms: boolean;
}

export interface JeunesRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  church?: string;
  tshirtSize: string;
  pickupLocation: string;
  paymentNetwork: string;
  paymentPhone: string;
}

export type PayinNetwork = "mtn" | "moov" | "celtiis_bj";

export interface InitiatePaymentPayload {
  network: PayinNetwork;
  phoneNumber: string;
  amount: number;
}

export interface InitiatedPayment {
  reference: string;
  network: PayinNetwork;
  amount: number;
}

export type FeexPayStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

export interface PaymentStatus {
  reference: string;
  status: FeexPayStatus;
  amount?: number;
  phoneNumber?: string;
}

export interface RegistrationResponse {
  id: string;
  registrationNumber: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    country?: string;
    church?: string;
    tshirtSize?: string;
    pickupLocation?: string;
    photo?: string;
  };
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
  };
  qrCode: string;
  badgePdf?: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface EventInfo {
  id: string;
  name: string;
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  logo?: string;
  image?: string;
  totalSlots: number;
  registeredCount: number;
  remainingSlots: number;
  status: "active" | "closed" | "upcoming" | "completed";
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
}


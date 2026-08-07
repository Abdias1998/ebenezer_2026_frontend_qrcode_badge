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

export interface RegistrationResponse {
  id: string;
  registrationNumber: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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


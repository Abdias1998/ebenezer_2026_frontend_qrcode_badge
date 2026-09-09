export type RecruitmentStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface Recruitment {
  _id: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  dateOfBirth: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address?: string;
  city?: string;
  country?: string;
  educationLevel: string;
  school?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  previousJob?: string;
  company?: string;
  duration?: string;
  skills: string[];
  churchName: string;
  pastorName?: string;
  yearsInChurch?: number;
  currentMinistry?: string;
  desiredPosition: string;
  motivation: string;
  availability?: string;
  additionalInfo?: string;
  status: RecruitmentStatus;
  createdAt: string;
}

export interface PaginatedRecruitments {
  items: Recruitment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

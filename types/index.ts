export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  status: string;
  email: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  image: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  user?: User;
  bio: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  experience: string;
  education: string;
  categoryId: string;
  category?: Category;
  availability?: Availability[];
  isVerified: boolean;
  profileImage?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tutorCount?: number;
}

export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  student?: User;
  tutor?: TutorProfile & { user: User };
  scheduledDate: string;
  startTime: string;
  endTime: string;
  subject: string;
  status: "confirmed" | "completed" | "cancelled";
  notes?: string;
  totalPrice: number;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  student?: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TutorFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  totalSpent?: number;
  totalEarned?: number;
  averageRating?: number;
}

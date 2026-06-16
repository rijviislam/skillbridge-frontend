import axios from "axios";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach token to every request

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sb_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-session-token"] = token;
    }
  }
  return config;
});
export default api;

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      const res = await api.post("/api/auth/sign-up/email", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      return res;
    } catch (err: any) {
      console.log("Register error:", err.response?.data);
      throw err;
    }
  },

  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/sign-in/email", {
      email: data.email,
      password: data.password,
    }),

  me: () => api.get("/api/auth/get-session"),
};
//  TUTOR API
export const tutorsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/api/tutors", { params }),
  getById: (userId: string) => api.get(`/api/tutors/${userId}`),
  getCategories: () => api.get("/api/admin/categories/public"),
};

// ─── Bookings ────────────────────────────────────────────
export const bookingsApi = {
  create: (data: { tutorId: string; availabilityId: string }) =>
    api.post("/api/bookings", data),
  getAll: (params?: Record<string, unknown>) =>
    api.get("/api/bookings", { params }),
  getById: (id: string) => api.get(`/api/bookings/${id}`),
  getMyBookings: () => api.get("/api/bookings/my"),
  cancel: (id: string) => api.patch(`/api/bookings/${id}/cancel`),
  complete: (id: string) => api.patch(`/api/bookings/${id}/complete`),
};

// ─── Tutor Management ────────────────────────────────────
export const tutorApi = {
  getProfile: () => api.get("/api/tutors/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/api/tutors/profile", {
      ...data,
      hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : undefined,
    }),
  getAvailability: () => api.get("/api/tutors/availability"),
  updateAvailability: (data: unknown) =>
    api.post("/api/tutors/availability", data),
  getSessions: (params?: Record<string, unknown>) =>
    api.get("/api/bookings", { params }),
  deleteAvailability: (availabilityId: string) => {
    return api.delete(`/tutors/availability/${availabilityId}`);
  },
};

// ─── Reviews ─────────────────────────────────────────────
export const reviewsApi = {
  create: (data: {
    bookingId: string;
    tutorId: string;
    rating: number;
    comment: string;
  }) => api.post("/api/reviews", data),
  getForTutor: (tutorId: string) => api.get(`/api/reviews?tutorId=${tutorId}`),
};

// ─── Admin ───────────────────────────────────────────────
export const adminApi = {
  getUsers: (params?: Record<string, unknown>) =>
    api.get("/api/admin/users", { params }),
  updateUserStatus: (id: string, data: { status: "ACTIVE" | "BANNED" }) =>
    api.patch(`/api/admin/users/${id}`, data),
  getBookings: (params?: Record<string, unknown>) =>
    api.get("/api/admin/bookings", { params }),
  getCategories: () => api.get("/api/admin/categories"),
  createCategory: (data: { name: string; description?: string }) =>
    api.post("/api/admin/categories", data),
  updateCategory: (id: string, data: { name: string; description?: string }) =>
    api.patch(`/api/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/api/admin/categories/${id}`),
  getStats: () => api.get("/api/admin/stats"),
};
export const userApi = {
  updateProfile: (data: { name?: string; image?: string }) =>
    api.patch("/api/tutors/user/update", data),
};

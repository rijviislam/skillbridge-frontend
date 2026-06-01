"use client";

import { authApi } from "@/lib/api";
import type { User } from "@/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<{ needsVerification: boolean }>;
  logout: () => void;
  refreshUser: () => void; // ✅ add this line
  isStudent: boolean;
  isTutor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    try {
      const savedToken = localStorage.getItem("sb_token");
      const savedUserStr = localStorage.getItem("sb_user");

      if (!savedToken || !savedUserStr) {
        setLoading(false);
        return;
      }

      const savedUser = JSON.parse(savedUserStr);
      setToken(savedToken);
      setUser(savedUser);
    } catch (err) {
      console.log("loadUser error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    console.log("=== FULL LOGIN RESPONSE ===");
    console.log("status:", response.status);
    console.log("data:", JSON.stringify(response.data, null, 2));

    const rawToken = response.data?.token;
    const rawUser = response.data?.user;

    console.log("rawToken:", rawToken);
    console.log("rawUser:", rawUser);

    if (!rawToken || !rawUser) {
      console.log("NO TOKEN OR USER - throwing error");
      throw new Error("Login failed");
    }

    console.log("Setting localStorage...");
    localStorage.setItem("sb_token", rawToken);
    localStorage.setItem("sb_user", JSON.stringify(rawUser));

    console.log("After setItem - token:", localStorage.getItem("sb_token"));

    setToken(rawToken);
    setUser(rawUser);

    console.log("Login complete!");
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<{ needsVerification: boolean }> => {
    const { data } = await authApi.register({ name, email, password, role });

    if (data?.user && !data?.token && !data?.session) {
      return { needsVerification: true };
    }

    const rawToken = data?.token || data?.session?.token;
    const rawUser = data?.user;

    if (rawToken && rawUser) {
      localStorage.setItem("sb_token", rawToken);
      localStorage.setItem("sb_user", JSON.stringify(rawUser));
      setToken(rawToken);
      setUser(rawUser);
    }

    return { needsVerification: false };
  };

  const logout = () => {
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  const role = user?.role?.toUpperCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser: loadUser,
        isStudent: role === "STUDENT",
        isTutor: role === "TUTOR",
        isAdmin: role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

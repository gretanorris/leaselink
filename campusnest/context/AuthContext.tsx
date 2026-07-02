import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "student" | "landlord";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university?: string;
  phone?: string;
  isVerified?: boolean;
  creditScore?: number;
  cosignerUploaded?: boolean;
  onboardingComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("leaselink_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  };

  const saveUser = async (u: User) => {
    await AsyncStorage.setItem("leaselink_user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      id: `${role[0]}${Date.now()}`,
      name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      isVerified: true,
      creditScore: role === "student" ? Math.floor(Math.random() * 200) + 600 : undefined,
      cosignerUploaded: false,
      onboardingComplete: role === "landlord",
    };
    await saveUser(newUser);
  };

  const register = async (name: string, email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      id: `${role[0]}${Date.now()}`,
      name,
      email,
      role,
      isVerified: false,
      creditScore: role === "student" ? Math.floor(Math.random() * 200) + 600 : undefined,
      cosignerUploaded: false,
      onboardingComplete: role === "landlord",
    };
    await saveUser(newUser);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    await saveUser(updated);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("leaselink_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

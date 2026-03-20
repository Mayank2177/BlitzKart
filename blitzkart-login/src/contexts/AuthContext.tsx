import React, { createContext, useContext, useState, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  phone?: string;
  joinedAt: number;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (profile: Omit<UserProfile, "joinedAt">) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bk-user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const login = useCallback((profile: Omit<UserProfile, "joinedAt">) => {
    const fullProfile: UserProfile = {
      ...profile,
      joinedAt: Date.now(),
    };
    setUser(fullProfile);
    localStorage.setItem("bk-user", JSON.stringify(fullProfile));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("bk-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

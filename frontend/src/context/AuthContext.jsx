import { useEffect, useState } from "react";

import {
  loginUser as loginApi,
  logoutUser as logoutApi,
} from "@/services/auth.service";

import { initializeSocket, closeSocket } from "@/services/socket.service";

import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      if (storedUser && token) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
    }

    return null;
  });

  const [isLoading] = useState(false);

  const isAuthenticated = Boolean(user && localStorage.getItem("accessToken"));

  useEffect(() => {
    if (!user || !isAuthenticated) {
      closeSocket();
      return;
    }

    initializeSocket();

    return () => {
      closeSocket();
    };
  }, [user, isAuthenticated]);

  const login = async (credentials) => {
    const response = await loginApi(credentials);

    const token = response.data?.token;
    const loggedInUser = response.data?.user;

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    if (loggedInUser) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    }

    return response;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      closeSocket();

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser) return;

    const nextUser = { ...user, ...updatedUser };
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

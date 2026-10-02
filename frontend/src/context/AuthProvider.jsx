import { useState } from "react";
import { AuthContext } from "./authContext";
import * as authService from "../services/authService";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser);

  const saveSession = (data) => {
    const profile = { name: data.name, email: data.email };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(profile));
    setToken(data.token);
    setUser(profile);
  };

  const login = async (email, password) => {
    saveSession(await authService.login(email, password));
  };

  const register = async (name, email, password) => {
    saveSession(await authService.register(name, email, password));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
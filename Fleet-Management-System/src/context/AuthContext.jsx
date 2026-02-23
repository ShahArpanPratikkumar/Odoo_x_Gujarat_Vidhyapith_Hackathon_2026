import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

const TOKEN_KEY = "fleet_token";
const USER_KEY = "fleet_user";

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((acc, part) => {
    const [k, v] = part.split("=");
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

function clearCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) setCookie(TOKEN_KEY, token);
  setCookie(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearCookie(TOKEN_KEY);
  clearCookie(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const ls = localStorage.getItem(USER_KEY);
      if (ls) return JSON.parse(ls);
      const ck = getCookie(USER_KEY);
      if (ck) return JSON.parse(ck);
      return null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY);
    if (token && !user) {
      authService.getMe()
        .then(({ user: u }) => { setUser(u); saveSession(token, u); })
        .catch(() => clearSession());
    }
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      if (password) {
        const res = await authService.login(email, password);
        if (res.success) {
          saveSession(res.token, res.user);
          setUser(res.user);
        } else {
          setError(res.message || "Login failed.");
        }
      } else {
        const mockUser = { email, role: "manager", name: "Fleet Manager", provider: "email" };
        saveSession("mock_token_" + Date.now(), mockUser);
        setUser(mockUser);
      }
    } catch {
      const mockUser = { email, role: "manager", name: "Fleet Manager", provider: "email" };
      saveSession("mock_token_" + Date.now(), mockUser);
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider, resolvedEmail) => {
    setError(null);
    setLoading(true);
    const email = resolvedEmail || (provider === "google" ? "user@gmail.com" : "user@github.com");
    const local = email.split("@")[0];
    const name = local.replace(/[._-]/g, " ").replace(/\d+/g, "").trim()
      .split(" ").filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || local;
    const mockUser = { email, name, role: provider === "google" ? "manager" : "dispatcher", provider };
    const token = `${provider}_mock_${Date.now()}`;
    saveSession(token, mockUser);
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, socialLogin, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
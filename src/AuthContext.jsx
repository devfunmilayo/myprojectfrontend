import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const BASE_URL = "import.meta.env.VITE_API_URL";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("mercova_user")) || null,
  );

  const saveUser = (token, userData) => {
    localStorage.setItem("mercova_token", token);
    localStorage.setItem("mercova_user", JSON.stringify(userData));
    setUser(userData);
  };

  const getToken = () => localStorage.getItem("mercova_token");

  // ── SIGN UP ──────────────────────────────────────────────────────────────────
  const signup = async ({ firstname, lastname, email, title, password }) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, title, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    saveUser(data.token, data.user);
  };

  // ── LOG IN ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    saveUser(data.token, data.user);
  };

  // ── LOG OUT ──────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("mercova_token");
    localStorage.removeItem("mercova_user");
    setUser(null);
  };

  // ── FINISH ONBOARDING ─────────────────────────────────────────────────────────
  const finishOnboarding = async () => {
    await fetch(`${BASE_URL}/users/finish-onboarding`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const updated = { ...user, isNewUser: false };
    localStorage.setItem("mercova_user", JSON.stringify(updated));
    setUser(updated);
  };

  // ── BECOME A SELLER ──────────────────────────────────────────────────────────
  const becomeSeller = async () => {
    const res = await fetch(`${BASE_URL}/users/become-seller`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const updated = { ...user, isSeller: true };
    localStorage.setItem("mercova_user", JSON.stringify(updated));
    setUser(updated);
  };

  // ── DELETE ACCOUNT ────────────────────────────────────────────────────────────
  // Permanently removes the user from the database then logs them out
  const deleteAccount = async () => {
    const res = await fetch(`${BASE_URL}/users/delete-account`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    // Clear everything and send to landing page
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        finishOnboarding,
        becomeSeller,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

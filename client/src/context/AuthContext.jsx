
import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  clearAuthData,
} from "../utils/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // RESTORE LOGGED-IN USER
  // =====================================================
  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================
  const loginUser = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "current_user",
      JSON.stringify(userData)
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const logoutUser = () => {
    clearAuthData();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
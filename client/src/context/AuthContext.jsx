// import {
//   createContext,
//   useEffect,
//   useState,
// } from "react";

// export const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Restore logged-in user
//   useEffect(() => {
//     const storedUser =
//       localStorage.getItem("current_user");

//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error(
//           "Invalid stored user:",
//           error
//         );

//         localStorage.removeItem(
//           "current_user"
//         );
//       }
//     }

//     setLoading(false);
//   }, []);

//   // Login
//   const loginUser = (userData) => {
//     setUser(userData);

//     localStorage.setItem(
//       "current_user",
//       JSON.stringify(userData)
//     );
//   };

//   // Logout
//   const logoutUser = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("current_user");

//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         loginUser,
//         logoutUser,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }



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
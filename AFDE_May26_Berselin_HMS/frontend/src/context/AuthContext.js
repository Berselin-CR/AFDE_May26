import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const role = sessionStorage.getItem("role");
    const username = sessionStorage.getItem("username");
    return role ? { role, username } : null;
  });

  const login = (role, username) => {
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("username", username);
    setAuth({ role, username });
  };

  const logout = () => {
    sessionStorage.clear();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

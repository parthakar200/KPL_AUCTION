import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Change this password to whatever you want
const ADMIN_PASSWORD = 'Kpl@2026';

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('kpl_role') || 'viewer';
  });

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setRole('admin');
      sessionStorage.setItem('kpl_role', 'admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole('viewer');
    sessionStorage.removeItem('kpl_role');
  };

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ role, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

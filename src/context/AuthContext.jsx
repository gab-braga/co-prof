import { createContext, useContext, useEffect, useState } from 'react';
import { firebaseLogin, firebaseLogout } from '../firebase/auth';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isLoadding, setIsLoadding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(data) {
    const token = await firebaseLogin(data);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }

  async function logout() {
    await firebaseLogout();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
    setIsLoadding(false);
  }, []);

  if (isLoadding) return <div>Carregando...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

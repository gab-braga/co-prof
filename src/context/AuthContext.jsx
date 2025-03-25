import { createContext, useContext, useEffect, useState } from 'react';
import {
  firebaseLogin,
  firebaseLoginGoogle,
  firebaseLogout,
  firebaseObserveTokenChanges,
} from '../firebase/auth';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(data) {
    await firebaseLogin(data);
  }

  async function loginGoogle() {
    await firebaseLoginGoogle();
  }

  async function logout() {
    await firebaseLogout();
  }

  function handleTokenChanges() {
    return firebaseObserveTokenChanges(
      (token) => {
        setIsAuthenticated(!!token);
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setIsAuthenticated(false);
        setIsLoading(false);
      },
    );
  }

  useEffect(() => {
    const unsubscribe = handleTokenChanges();
    return () => unsubscribe();
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, loginGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

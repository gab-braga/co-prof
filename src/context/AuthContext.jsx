import { createContext, useContext, useState } from 'react';
import { firebaseLogin, firebaseLogout } from '../firebase/auth';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [logged, setLogged] = useState(false);

  async function login(data) {
    const token = await firebaseLogin(data);
    localStorage.setItem('token', token);
    setLogged(true);
  }

  async function logout() {
    await firebaseLogout();
    localStorage.removeItem('token');
    setLogged(false);
  }

  return (
    <AuthContext.Provider value={{ logged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

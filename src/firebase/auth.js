import axios from 'axios';
import app from './app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth(app);

async function login({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const token = await user.getIdToken();
  localStorage.setItem('token', token);
}

async function logout() {
  await signOut(auth);
  localStorage.removeItem('token');
}

export { login, logout };

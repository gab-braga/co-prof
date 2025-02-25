import axios from 'axios';
import app from './app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import api from '../api/api';

const auth = getAuth(app);

async function createUser(data) {
  await api.post('/users', data);
}

async function login({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const token = await user.getIdToken();
  localStorage.setItem('token', token);
}

async function logout() {
  await signOut(auth);
  localStorage.removeItem('token');
}

export { createUser, login, logout };

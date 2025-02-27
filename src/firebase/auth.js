import axios from 'axios';
import app from './app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth(app);

async function firebaseLogin({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const token = await user.getIdToken();
  return token;
}

async function firebaseLogout() {
  await signOut(auth);
}

export { firebaseLogin, firebaseLogout };

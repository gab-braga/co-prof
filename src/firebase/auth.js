import axios from 'axios';
import app from './app';
import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const auth = getAuth(app);

async function firebaseLogin({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const token = await user.getIdToken();
  return token;
}

async function firebaseLoginGoogle() {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  const token = await user.getIdToken();
  return token;
}

async function firebaseLogout() {
  await signOut(auth);
}

async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export { firebaseLogin, firebaseLoginGoogle, firebaseLogout, resetPassword };

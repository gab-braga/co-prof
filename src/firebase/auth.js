import app from './app';
import {
  getAuth,
  GoogleAuthProvider,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const auth = getAuth(app);

async function firebaseLogin({ email, password }) {
  await signInWithEmailAndPassword(auth, email, password);
}

async function firebaseLoginGoogle() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function firebaseLogout() {
  await signOut(auth);
}

async function firebaseResetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

function firebaseObserveTokenChanges(handleChangeToken, handleError = () => { }) {
  return onIdTokenChanged(
    auth,
    async (user) => {
      if (user) {
        const token = await user.getIdToken();
        handleChangeToken(token);
      } else {
        handleChangeToken(null);
      }
    },
    handleError
  );
}

export {
  firebaseLogin,
  firebaseLoginGoogle,
  firebaseLogout,
  firebaseResetPassword,
  firebaseObserveTokenChanges
};

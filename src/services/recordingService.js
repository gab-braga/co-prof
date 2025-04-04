import api from '../api/api';
import { firebaseUserToken } from '../firebase/auth';

async function createRecording(data) {
  const token = await firebaseUserToken();
  await api.post('/recordings', data, {
    headers: {
      Authorization: token,
    },
  });
}

export { createRecording };

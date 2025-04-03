import api from '../api/api';
import { firebaseUserToken } from '../firebase/auth';

async function uploadFile(blob) {
  const formData = new FormData();
  formData.append('file', blob);

  const token = await firebaseUserToken();
  const response = await api.post('/storage/upload', formData, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export { uploadFile };

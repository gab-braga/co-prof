import { firebaseGetUserId, firebaseUserToken } from '../firebase/auth';
import { firebaseUploadBlob } from '../firebase/storage';
import api from '../api/api';

async function uploadFile(blob) {
  const userId = firebaseGetUserId();
  const response = await firebaseUploadBlob(blob, userId);
  return response;
}

async function uploadFileAPI(blob) {
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

export { uploadFile, uploadFileAPI };

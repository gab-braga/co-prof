import { firebaseGetUserId, firebaseUserToken } from '../firebase/auth';
import { firebaseUploadBlob } from '../firebase/storage';
import api from '../api/api';

async function uploadFile(blob) {
  const userId = firebaseGetUserId();
  const fileURL = await firebaseUploadBlob(blob, userId);
  return fileURL;
}

async function uploadMultipleFiles(blobs) {
  if (!Array.isArray(blobs)) throw new Error("Blobs is not Array.");

  const promises = blobs.map((blob) => uploadFile(blob));

  const response = await Promise.all(promises);
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

export { uploadFile, uploadMultipleFiles, uploadFileAPI };

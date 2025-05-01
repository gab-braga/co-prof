import api from '../api/api';
import { firebaseUserToken } from '../firebase/auth';

async function createRecording(data) {
  const token = await firebaseUserToken();
  const response = await api.post('/recordings', data, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
}

async function findRecordingsByClassId(id) {
  const token = await firebaseUserToken();
  const response = await api.get(`/recordings/classes/${id}`, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function deleteRecording(id) {
  const token = await firebaseUserToken();
  const response = await api.delete(`/recordings/${id}`, {
    headers: { Authorization: token },
  });
  return response.data;
}

export {
  createRecording,
  findRecordingsByClassId,
  deleteRecording
};

import api from '../api/api';
import { firebaseUserToken } from '../firebase/auth';

async function createUser(data) {
  await api.post('/users', data);
}

async function getAuthenticatedUser() {
  const token = await firebaseUserToken();
  const response = await api.get(`/users/me`, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function updateUser(data) {
  const token = await firebaseUserToken();
  const response = await api.put('/users', data, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function updateUserPassword(data) {
  const token = await firebaseUserToken();
  const response = await api.put('/users/password', data, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function deleteUser() {
  const token = await firebaseUserToken();
  const response = await api.delete('/users', {
    headers: { Authorization: token },
  });
  return response.data;
}

export {
  createUser,
  getAuthenticatedUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};

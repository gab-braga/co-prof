import api from '../api/api';
import { firebaseUserToken } from '../firebase/auth';

async function createClass(data) {
  const token = await firebaseUserToken();
  const response = await api.post('/classes', data, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function findAllClasses() {
  const token = await firebaseUserToken();
  const response = await api.get('/classes', {
    headers: { Authorization: token },
  });
  return response.data;
}

async function findClass(id) {
  const token = await firebaseUserToken();
  const response = await api.get(`/classes/${id}`, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function updateClass(id, data) {
  const token = await firebaseUserToken();
  const response = await api.put(`/classes/${id}`, data, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function deleteClass(id) {
  const token = await firebaseUserToken();
  const response = await api.delete(`/classes/${id}`, {
    headers: { Authorization: token },
  });
  return response.data;
}

export { createClass, findAllClasses, findClass, updateClass, deleteClass };

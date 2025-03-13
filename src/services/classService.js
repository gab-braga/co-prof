import api from '../api/api';

async function createClass(data) {
  const token = localStorage.getItem('token');
  const response = await api.post('/classes', data, {
    headers: { Authorization: token },
  });
  return response.data;
}

async function findAllClasses() {
  const token = localStorage.getItem('token');
  const response = await api.get('/classes', {
    headers: { Authorization: token },
  });
  return response.data;
}

async function findClass(id) {
  const token = localStorage.getItem('token');
  const response = await api.get(`/classes/${id}`, {
    headers: { Authorization: token },
  });
  return response.data;
}

export { createClass, findAllClasses, findClass };

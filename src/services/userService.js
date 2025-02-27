import api from '../api/api';

async function createUser(data) {
  await api.post('/users', data);
}

export { createUser };

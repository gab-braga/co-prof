import axios from 'axios';

// const baseURL = 'http://localhost:3000';
const baseURL = 'https://co-prof-api.vercel.app';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;

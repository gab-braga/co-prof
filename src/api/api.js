import axios from 'axios';

// const baseURL = 'http://localhost:8080';
const baseURL = 'https://coprof.azurewebsites.net';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;

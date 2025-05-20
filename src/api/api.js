import axios from 'axios';

// const baseURL = 'http://localhost:8080';
// const baseURL = 'https://coprof.azurewebsites.net';
const baseURL = 'https://co-prof-api-509264289385.us-west1.run.app';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;

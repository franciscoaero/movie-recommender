import axios from 'axios';

const api = axios.create({
  baseURL: '${backendUrl}', // URL do seu back-end Flask
});

export default api;
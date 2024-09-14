import axios from 'axios';

const api = axios.create({
  baseURL: 'https://app-movies-dev-001-a7c0f2b7a3bwckgc.brazilsouth-01.azurewebsites.net', // URL do seu back-end Flask
});

export default api;
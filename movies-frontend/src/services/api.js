import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './msalConfig';

// Criando a instância MSAL
const msalInstance = new PublicClientApplication(msalConfig);

// Criando a instância axios com a base URL
const api = axios.create({
  baseURL: 'https://app-movies-dev-001-a7c0f2b7a3bwckgc.brazilsouth-01.azurewebsites.net', // URL do seu back-end Flask
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      console.error('No active account! Please log in.');
      return config;
    }

    // Tentar adquirir o token de forma silenciosa
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      // Log para verificar o token antes de enviar a requisição
      console.log('Token JWT sendo enviado:', response.accessToken);

      // Adicionar o token de autenticação no cabeçalho da requisição
      config.headers['Authorization'] = `Bearer ${response.accessToken}`;
    } catch (error) {
      console.error('Error acquiring token silently:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './msalConfig';

const msalInstance = new PublicClientApplication(msalConfig);

const api = axios.create({
  baseURL: 'https://app-movies-dev-001-a7c0f2b7a3bwckgc.brazilsouth-01.azurewebsites.net', 
});

api.interceptors.request.use(
  async (config) => {
    const account = msalInstance.getActiveAccount();
    console.log('Current Account:', account);  // Log da conta ativa

    if (!account) {
      console.error('No active account! Please log in.');
      return config;
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      console.log('Token Acquired:', response.accessToken);  // Log do token adquirido
      config.headers['Authorization'] = `Bearer ${response.accessToken}`;
    } catch (error) {
      console.error('Error acquiring token silently:', error);  // Log de erro na aquisição do token
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';

function LoginButton() {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .then(response => {
                if (response && response.account && response.idToken) {
                    console.log('Login Response:', response);  // Log da resposta do login
                    console.log('Access Token:', response.idToken);  // Verificar o token de acesso
                } else {
                    console.error('Invalid login response.');
                }
            })
            .catch(error => {
                console.error('Login Error:', error);  // Log de erro caso algo dê errado no login
            });
    };

    return <button onClick={handleLogin}>Login</button>;
}

export default LoginButton;

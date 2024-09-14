import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';

const LoginButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .then(response => {
                console.log('Login bem-sucedido', response);
            })
            .catch(e => {
                console.error('Erro durante o login', e);
            });
    };

    return (
        <button onClick={handleLogin}>
            Login
        </button>
    );
};

export default LoginButton;

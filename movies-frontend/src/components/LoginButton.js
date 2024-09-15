import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';

function LoginButton() {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .then(response => {
                // O token de acesso estará em response.accessToken
                console.log('Access Token:', response.accessToken);
            })
            .catch(error => console.error(error));
    };

    return <button onClick={handleLogin}>Login</button>;
}

export default LoginButton;

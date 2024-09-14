// msalConfig.js
export const msalConfig = {
    auth: {
      clientId: "aaece82d-86c9-4dbb-be37-60f630246081",  // O Client ID da sua App Registration
      authority: "https://login.microsoftonline.com/0048f0f6-d15a-46a0-b109-6a22f5e24647",  // Substitua pelo seu Tenant ID
      redirectUri: window.location.origin,  // A URL para onde o usuário será redirecionado após login
    },
    cache: {
      cacheLocation: "localStorage",  // Você pode usar sessionStorage ou localStorage
      storeAuthStateInCookie: false,  // Defina como true para suportar navegadores mais antigos
    }
  };
  
  export const loginRequest = {
    scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"]  // O escopo de acesso para sua API
  };
  
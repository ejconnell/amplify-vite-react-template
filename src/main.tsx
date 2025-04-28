import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { AuthProvider } from "react-oidc-context";

Amplify.configure(outputs);

const remoteCognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn",
  client_id: "6dmaip976mpqdf8tjs0q6n15qj",
  redirect_uri: "https://main.d2c06f7nh1jalc.amplifyapp.com",
  /* redirect_uri: "https://d84l1y8p4kdic.cloudfront.net", */
  response_type: "code",
  scope: "phone openid email",
};

const localhostCognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn",
  client_id: "3h66igtcn7d3819or7a8ftfemc",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};

const cognitoAuthConfig = window.location.hostname === "localhost" ? localhostCognitoAuthConfig : remoteCognitoAuthConfig;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

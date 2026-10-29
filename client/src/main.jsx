import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from "./components/Router.jsx";
//import App from './components/App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Router />
  </GoogleOAuthProvider>
)

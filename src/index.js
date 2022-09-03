import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthProvider';
import { SnackbarProvider } from "notistack"; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  </AuthProvider>
);
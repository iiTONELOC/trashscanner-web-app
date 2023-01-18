import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider, ToastProvider } from './providers';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ToastProvider>
  </React.StrictMode >
);

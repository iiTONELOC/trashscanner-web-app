import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './providers';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode >
);

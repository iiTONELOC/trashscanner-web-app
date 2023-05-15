import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './components';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode >

);

serviceWorkerRegistration.register();

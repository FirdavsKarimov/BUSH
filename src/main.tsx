import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getUserId } from './utils/auth';

// Initialize user ID on app load
getUserId();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



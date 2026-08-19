import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { injectThemeCSSVariables } from './theme/theme.js';

// Initialize centralized industrial CSS variables on DOM root
injectThemeCSSVariables('dark');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

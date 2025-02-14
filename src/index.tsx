import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { IntlProvider } from './i18n/IntlProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </React.StrictMode>
); 
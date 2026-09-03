import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import App from './App';
import './index.css';
import { initAnalytics } from './analytics';

initAnalytics();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

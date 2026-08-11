import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/animations.css';
import './styles/layout.css';
import App from './App.jsx';
import { initAnalytics } from './utils/analytics';

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

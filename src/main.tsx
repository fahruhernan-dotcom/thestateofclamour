import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Prevent mobile browser from auto-scrolling to cached scroll positions on fresh load/refresh
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Purge any stale Service Worker & Cache Storage so browser loads 100% original full-quality media
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const r of registrations) {
      r.unregister();
    }
  });
}
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((keys) => {
    for (const k of keys) {
      caches.delete(k);
    }
  });
}


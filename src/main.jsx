import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Function to enable mocking
async function enableMocking() {
  // This is the important part!
  // It checks for the Vercel environment variable.
  if (import.meta.env.VITE_API_MOCKING !== 'enabled') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  // Start the worker
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// Enable mocking before rendering the app
enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
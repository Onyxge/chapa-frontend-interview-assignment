import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Start MSW in development
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Create a root element and render the application inside BrowserRouter
// This ensures that all router hooks have access to router context
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);

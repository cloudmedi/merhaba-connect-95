import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/providers/AuthProvider'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
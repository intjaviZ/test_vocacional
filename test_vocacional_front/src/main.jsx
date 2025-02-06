import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ContextRespuestasProvider } from './contextos/ContextTest.jsx'
import { ContextResultadosProvider } from './contextos/ContextResultados.jsx'
import { ContextUserProvider } from './contextos/ContextUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextUserProvider>
      <ContextRespuestasProvider>
        <ContextResultadosProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ContextResultadosProvider>
      </ContextRespuestasProvider>
    </ContextUserProvider>
  </StrictMode>,
)

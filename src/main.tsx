import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AppRoutes } from './App.tsx'
import { createHeadStore, HeadProvider } from './components/HeadProvider'
import { PreferencesProvider } from './components/PreferencesProvider'

const headStore = createHeadStore()

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <HeadProvider store={headStore}>
      <PreferencesProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PreferencesProvider>
    </HeadProvider>
  </StrictMode>,
)

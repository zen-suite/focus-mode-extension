import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import AppThemeProvider from '../providers/AppThemeProvider'
import { BlockedSitesProvider } from '../providers/BlockedSitesProvider'
import BlockedSite from './BlockedSite'

function Main() {
  return (
    <React.StrictMode>
      <AppThemeProvider>
        <CssBaseline enableColorScheme />
        <BlockedSitesProvider>
          <BlockedSite />
        </BlockedSitesProvider>
      </AppThemeProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Main />
)

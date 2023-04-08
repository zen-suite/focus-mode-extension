import React from 'react'
import ReactDOM from 'react-dom/client'
import AppThemeProvider from '../providers/AppThemeProvider'
import { CssBaseline } from '@mui/material'
import BlockedSite from './BlockedSite'

function Main() {
  return (
    <React.StrictMode>
      <AppThemeProvider>
        <CssBaseline enableColorScheme />
        <BlockedSite />
      </AppThemeProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Main />
)

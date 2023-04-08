import React from 'react'
import ReactDOM from 'react-dom/client'
import AppThemeProvider from '../providers/AppThemeProvider'
import '../util/fonts'
import Options from './Options'
import { CssBaseline } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <CssBaseline enableColorScheme />
      <Options />
    </AppThemeProvider>
  </React.StrictMode>
)

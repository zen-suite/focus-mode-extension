import { CssBaseline } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import AppThemeProvider from '../providers/AppThemeProvider'
import '../util/fonts'
import Options from './Options'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <CssBaseline enableColorScheme />
      <Options />
    </AppThemeProvider>
  </React.StrictMode>
)

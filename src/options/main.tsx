import { CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'
import AppThemeProvider from '../providers/AppThemeProvider'
import '../util/fonts'
import Options from './Options'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          <CssBaseline enableColorScheme />
          <Options />
        </SnackbarProvider>
      </LocalizationProvider>
    </AppThemeProvider>
  </React.StrictMode>
)

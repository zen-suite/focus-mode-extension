import { CssBaseline } from '@mui/material'
import AppThemeProvider from '../providers/AppThemeProvider'
import { BlockedSitesProvider } from '../providers/BlockedSitesProvider'
import './App.css'
import AppContentContainer from './AppContentContainer'

function App(): JSX.Element {
  return (
    <AppThemeProvider>
      <BlockedSitesProvider>
        <CssBaseline enableColorScheme />
        <AppContentContainer />
      </BlockedSitesProvider>
    </AppThemeProvider>
  )
}

export default App

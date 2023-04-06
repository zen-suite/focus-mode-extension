import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function AppThemeProvider(props: React.PropsWithChildren) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

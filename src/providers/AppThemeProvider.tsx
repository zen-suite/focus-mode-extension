import { ThemeProvider, createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useMemo } from 'react'

export default function AppThemeProvider(props: React.PropsWithChildren) {
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: 'dark',
        background: {
          default: '#242424',
        },
        primary: {
          main: grey[300],
        },
      },
      typography: {
        button: {
          textTransform: 'none',
        },
      },
      components: {
        MuiButton: {
          defaultProps: {
            variant: 'outlined',
          },
        },
      },
    })
  }, [])
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

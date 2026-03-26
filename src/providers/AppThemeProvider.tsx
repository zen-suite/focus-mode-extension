import { ThemeProvider, alpha, createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useMemo } from 'react'

export default function AppThemeProvider(props: React.PropsWithChildren) {
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: 'dark',
        background: {
          default: '#111111',
          paper: '#181818',
        },
        text: {
          primary: '#f5f5f5',
          secondary: grey[500],
        },
        divider: alpha('#ffffff', 0.1),
        primary: {
          main: grey[300],
          dark: grey[800],
        },
      },
      typography: {
        h3: {
          fontWeight: 700,
          letterSpacing: '-0.03em',
        },
        h4: {
          fontWeight: 700,
          letterSpacing: '-0.02em',
        },
        h5: {
          fontWeight: 700,
        },
        h6: {
          fontWeight: 600,
        },
        subtitle2: {
          fontWeight: 600,
        },
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundImage:
                'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 35%)',
            },
          },
        },
        MuiButton: {
          defaultProps: {
            variant: 'outlined',
          },
          styleOverrides: {
            root: {
              borderRadius: 999,
              paddingInline: 16,
            },
            contained: {
              backgroundColor: grey[100],
              color: grey[900],
              '&:hover': {
                backgroundColor: grey[300],
              },
            },
            outlined: {
              borderColor: alpha('#ffffff', 0.16),
              '&:hover': {
                borderColor: alpha('#ffffff', 0.28),
                backgroundColor: alpha('#ffffff', 0.04),
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              border: `1px solid ${alpha('#ffffff', 0.08)}`,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              borderRadius: 20,
              border: `1px solid ${alpha('#ffffff', 0.08)}`,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              border: `1px solid ${alpha('#ffffff', 0.08)}`,
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              backgroundColor: alpha('#ffffff', 0.02),
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              '&.Mui-checked': {
                color: grey[100],
              },
              '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: grey[500],
              },
            },
            track: {
              backgroundColor: grey[700],
            },
          },
        },
      },
    })
  }, [])
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

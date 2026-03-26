import { ThemeProvider, alpha, createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useMemo } from 'react'

export default function AppThemeProvider(props: React.PropsWithChildren) {
  const theme = useMemo(() => {
    const appBackground = '#0b0b0b'
    const paperBackground = '#161616'
    const elevatedBackground = '#1d1d1d'
    const borderColor = alpha('#ffffff', 0.14)
    const strongBorderColor = alpha('#ffffff', 0.22)

    return createTheme({
      palette: {
        mode: 'dark',
        background: {
          default: appBackground,
          paper: paperBackground,
        },
        text: {
          primary: '#f5f5f5',
          secondary: grey[400],
        },
        divider: borderColor,
        primary: {
          main: grey[200],
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
              backgroundColor: appBackground,
              backgroundImage:
                'radial-gradient(circle at top, rgba(255,255,255,0.09), transparent 38%)',
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
              borderWidth: 1,
            },
            contained: {
              backgroundColor: grey[100],
              color: grey[900],
              '&:hover': {
                backgroundColor: grey[200],
              },
            },
            outlined: {
              borderColor,
              '&:hover': {
                borderColor: strongBorderColor,
                backgroundColor: alpha('#ffffff', 0.08),
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: paperBackground,
              border: `1px solid ${borderColor}`,
              boxShadow: `0 0 0 1px ${alpha('#000000', 0.12)}`,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: elevatedBackground,
              borderRadius: 20,
              border: `1px solid ${borderColor}`,
              boxShadow: `0 20px 40px ${alpha('#000000', 0.24)}`,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              border: `1px solid ${borderColor}`,
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
              backgroundColor: alpha('#ffffff', 0.04),
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: strongBorderColor,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: grey[300],
                borderWidth: 1,
              },
            },
            notchedOutline: {
              borderColor,
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              border: `1px solid transparent`,
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.06),
                borderColor,
              },
              '&.Mui-selected': {
                backgroundColor: alpha('#ffffff', 0.1),
                borderColor: strongBorderColor,
              },
              '&.Mui-selected:hover': {
                backgroundColor: alpha('#ffffff', 0.12),
              },
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              border: `1px solid ${alpha('#ffffff', 0.08)}`,
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.08),
                borderColor,
              },
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
              backgroundColor: grey[800],
              opacity: 1,
            },
          },
        },
      },
    })
  }, [])
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

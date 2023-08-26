import type { Preview } from '@storybook/react'
import React from 'react'
import AppThemeProvider from '../src/providers/AppThemeProvider'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <AppThemeProvider>
          <Story />
        </AppThemeProvider>
      )
    },
  ],
}

export default preview

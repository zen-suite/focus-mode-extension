import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { vitest } from 'vitest'
import { AddOrSearchBlockedSite } from './AddOrSearchBlockedSite'

interface IProps extends React.ComponentProps<typeof AddOrSearchBlockedSite> {}

describe(AddOrSearchBlockedSite, () => {
  function renderComponent(props?: Partial<IProps>) {
    const defaultProps: IProps = {
      allowCreation: true,
      onAddBlockSite: vitest.fn(),
      onFetchSites: vitest.fn(),
      ...props,
    }

    const renderResult = render(<AddOrSearchBlockedSite {...defaultProps} />)
    return {
      ...renderResult,
      ...defaultProps,
    }
  }

  it('renders component correctly', () => {
    renderComponent()
    expect(
      screen.getByPlaceholderText('Type website to search or add')
    ).not.toBeNull()
  })

  it('calls fetch sites when a user is typing', async () => {
    const { onFetchSites } = renderComponent()
    const input = screen.getByPlaceholderText('Type website to search or add')
    fireEvent.change(input, {
      target: {
        value: 'hello',
      },
    })
    expect(onFetchSites).toBeCalledTimes(1)
    await waitFor(() => {
      expect(onFetchSites).toBeCalledWith('hello')
    })
  })

  it('calls add site when a domain is valid and user press enters', async () => {
    const { onAddBlockSite } = renderComponent({ allowCreation: true })
    const input = screen.getByPlaceholderText('Type website to search or add')
    fireEvent.change(input, {
      target: {
        value: 'http://example.com',
      },
    })
    fireEvent.keyDown(input, {
      key: 'enter',
    })
    expect(onAddBlockSite).toBeCalledTimes(1)
    await waitFor(() => {
      expect(onAddBlockSite).toBeCalledWith('example.com')
    })
  })

  it('do not call add site when a domain is INVALID and user presses enter', () => {
    const { onAddBlockSite } = renderComponent({ allowCreation: true })
    const input = screen.getByPlaceholderText('Type website to search or add')
    fireEvent.change(input, {
      target: {
        value: 'example',
      },
    })
    fireEvent.keyDown(input, {
      key: 'enter',
    })
    expect(onAddBlockSite).toBeCalledTimes(0)
  })
})

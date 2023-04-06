import { useEffect, useState } from 'react'
import { addBlockRule, findBlockRuleByDomain } from '../block-rules'
import {
  getHostDomain,
  getHostUrl,
  isHttpProtocol,
  reloadHostTab,
} from '../util/host'
import './App.css'
import { CssBaseline, Link } from '@mui/material'
import AppThemeProvider from '../providers/APpThemeProvider'

function useIsDomainBlock(): boolean {
  const [isDomainBlocked, setIsDomainBlocked] = useState(false)

  async function updateIsDomainBlocked(): Promise<void> {
    const currentDomain = await getHostDomain()
    const isHostHttpProtocol = isHttpProtocol(await getHostUrl())
    if (!isHostHttpProtocol || !currentDomain) {
      setIsDomainBlocked(true)
      return
    }
    const rule = await findBlockRuleByDomain(currentDomain)
    setIsDomainBlocked(!!rule)
  }

  useEffect(() => {
    updateIsDomainBlocked()
      .then(() => {})
      .catch(() => {})
  }, [])

  return isDomainBlocked
}

function App(): JSX.Element {
  const [loading, setLoading] = useState(false)

  const isDomainBlocked = useIsDomainBlock()
  async function blockWebsite(): Promise<void> {
    try {
      setLoading(true)
      const currentDomain = await getHostDomain()
      if (!currentDomain) {
        return
      }

      await addBlockRule(currentDomain)
      await reloadHostTab()
    } finally {
      setLoading(false)
    }
  }

  function goToOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  }

  return (
    <AppThemeProvider>
      <CssBaseline enableColorScheme />
      <div className="App">
        <h1>Zen mode extension</h1>
        <div className="card">
          <button disabled={loading || isDomainBlocked} onClick={blockWebsite}>
            {isDomainBlocked ? 'You cannot block this site' : 'Block this site'}
          </button>

          <Link
            style={{
              color: 'gray',
              textDecorationColor: 'gray',
              cursor: 'pointer',
            }}
            marginY={5}
            display="block"
            variant="subtitle2"
            onClick={goToOptionsPage}
          >
            Go to options page
          </Link>
        </div>
      </div>
    </AppThemeProvider>
  )
}

export default App

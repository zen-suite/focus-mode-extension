import { useEffect, useState } from 'react'
import { addBlockRule, findBlockRuleByDomain } from '../block-rules'
import {
  getHostDomain,
  getHostUrl,
  isHttpProtocol,
  reloadHostTab,
} from '../util/host'
import './App.css'

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

  return (
    <div className="App">
      <h1>Zen mode extension</h1>
      <div className="card">
        <button disabled={loading || isDomainBlocked} onClick={blockWebsite}>
          Block this website.
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

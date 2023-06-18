import { Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AppLink from '../components/AppLink'
import { addBlockedSite, type IBlockedSite } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import { getHostDomain, getHostUrl, isHttpProtocol } from '../util/host'

interface IInjectedProps {
  blockedSites: IBlockedSite[]
  blockSite: () => Promise<void>
  validDomain: boolean
  goToOptionsPage: () => void
  currentDomain: string | undefined
}

function useIsDomainValid() {
  const [validDomain, setIsDomainBlocked] = useState(false)

  async function checkIsDomainValid(): Promise<void> {
    const currentDomain = await getHostDomain()
    const isHostHttpProtocol = isHttpProtocol(await getHostUrl())

    setIsDomainBlocked(Boolean(currentDomain && isHostHttpProtocol))
  }

  useEffect(() => {
    checkIsDomainValid()
      .then(() => {})
      .catch(() => {})
  }, [])

  return validDomain
}

export default function AppContentContainer() {
  const { blockedSites, refetchBlockedSites } = useBlockedSites()
  const [currentDomain, setCurrentDomain] = useState<string | undefined>()

  useEffect(() => {
    getHostDomain().then(setCurrentDomain)
  }, [])

  async function blockWebsite() {
    if (!currentDomain) {
      return
    }
    await addBlockedSite(currentDomain)
    await refetchBlockedSites()
  }

  const validDomain = useIsDomainValid()

  function goToOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  }

  return (
    <AppContent
      validDomain={validDomain}
      blockedSites={blockedSites}
      blockSite={blockWebsite}
      goToOptionsPage={goToOptionsPage}
      currentDomain={currentDomain}
    />
  )
}

export function AppContent(props: IInjectedProps) {
  const [loading, setLoading] = useState(false)

  const isDomainAlreadyBlocked = useMemo(() => {
    return Boolean(
      props.blockedSites.find(
        (blockedSite) => blockedSite.domain === props.currentDomain
      )
    )
  }, [props.blockedSites, props.currentDomain])

  const buttonText = useMemo(() => {
    if (isDomainAlreadyBlocked) {
      return 'This website is already blocked'
    }
    if (!props.validDomain) {
      return 'You cannot block this site'
    }

    return 'Block this website'
  }, [isDomainAlreadyBlocked, props.validDomain])

  async function blockSite() {
    try {
      setLoading(true)
      await props.blockSite()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>Zen mode extension</h1>
      <div className="card">
        <Button
          disabled={loading || !props.validDomain || isDomainAlreadyBlocked}
          onClick={blockSite}
          variant="outlined"
        >
          {buttonText}
        </Button>
        {isDomainAlreadyBlocked && (
          <Typography
            variant="caption"
            display="block"
            marginTop={2}
            color="gray"
          >
            If you are still seeing the website, please try reloading it.
          </Typography>
        )}

        <AppLink
          marginY={5}
          display="block"
          variant="subtitle2"
          onClick={props.goToOptionsPage}
        >
          Go to options page
        </AppLink>
      </div>
    </div>
  )
}

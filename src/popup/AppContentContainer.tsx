import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AppLink from '../components/AppLink'
import { PomodoroStatus } from '../components/PomodoroStatus'
import {
  getBlockSiteStorage,
  type IBlockedSite,
  type IPomodoroState,
} from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import { getHostDomain, getHostUrl, isHttpProtocol } from '../util/host'

interface IInjectedProps {
  blockedSites: IBlockedSite[]
  blockSite: () => Promise<void>
  validDomain: boolean
  goToOptionsPage: () => void
  currentDomain: string | undefined
  pomodoro: IPomodoroState
  onStartPomodoro: () => Promise<void>
  onStopPomodoro: () => Promise<void>
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
  const {
    blockedSites,
    pomodoro,
    refetchSchema: refetchBlockedSites,
  } = useBlockedSites()
  const [currentDomain, setCurrentDomain] = useState<string | undefined>()

  useEffect(() => {
    getHostDomain().then(setCurrentDomain)
  }, [])

  async function blockWebsite() {
    if (!currentDomain) {
      return
    }
    await getBlockSiteStorage().addBlockSite(currentDomain)
    await refetchBlockedSites()
  }

  async function startPomodoro() {
    await getBlockSiteStorage().startPomodoro()
    await refetchBlockedSites()
  }

  async function stopPomodoro() {
    await getBlockSiteStorage().stopPomodoro()
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
      pomodoro={pomodoro}
      onStartPomodoro={startPomodoro}
      onStopPomodoro={stopPomodoro}
    />
  )
}

export function AppContent(props: IInjectedProps) {
  const [loading, setLoading] = useState(false)
  const [pomodoroLoading, setPomodoroLoading] = useState(false)

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

  async function onPomodoroClick() {
    try {
      setPomodoroLoading(true)
      if (props.pomodoro.isActive) {
        await props.onStopPomodoro()
      } else {
        await props.onStartPomodoro()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    } finally {
      setPomodoroLoading(false)
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

        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Pomodoro
              </Typography>
              <PomodoroStatus pomodoro={props.pomodoro} />
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="contained"
                disabled={pomodoroLoading}
                onClick={onPomodoroClick}
              >
                {props.pomodoro.isActive ? 'Stop pomodoro' : 'Start pomodoro'}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </div>
    </div>
  )
}

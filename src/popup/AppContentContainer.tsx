import { Box, Button, Paper, Stack, Typography } from '@mui/material'
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
    <Box
      sx={{
        width: 400,
        minHeight: 420,
        px: 2.5,
        py: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            pb: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography color="text.secondary" variant="overline">
            Focus Mode
          </Typography>
          <Typography variant="h5">Block distractions quickly</Typography>
          <Typography color="text.secondary" mt={0.75} variant="body2">
            Add the current site without leaving your tab.
          </Typography>
        </Box>

        <Paper sx={{ p: 2.5 }}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="caption">
              Current website
            </Typography>
            <Typography variant="h6">
              {props.currentDomain ?? 'Unsupported page'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {props.validDomain
                ? isDomainAlreadyBlocked
                  ? 'This domain is already in your blocked list.'
                  : 'This page can be blocked immediately.'
                : 'Only regular website pages can be blocked.'}
            </Typography>
          </Stack>
        </Paper>

        <Button
          disabled={loading || !props.validDomain || isDomainAlreadyBlocked}
          onClick={blockSite}
          variant={isDomainAlreadyBlocked ? 'outlined' : 'contained'}
          fullWidth
          size="large"
          sx={{
            py: 1.25,
          }}
        >
          {buttonText}
        </Button>

        {isDomainAlreadyBlocked && (
          <Typography color="text.secondary" variant="caption">
            If the page is still visible, reload the tab so the blocking rule
            applies.
          </Typography>
        )}

        {props.pomodoro.isActive && (
          <PomodoroStatus
            pomodoro={props.pomodoro}
            inactiveMessage="Pomodoro is ready when you want timed focus sessions."
          />
        )}

        <Paper sx={{ p: 2.25 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box flexGrow={1}>
              <Typography variant="subtitle2">Extension settings</Typography>
              <Typography color="text.secondary" variant="body2">
                Manage blocked sites, breaks, and pomodoro timing.
              </Typography>
            </Box>
            <AppLink
              variant="subtitle2"
              onClick={props.goToOptionsPage}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Open settings
            </AppLink>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

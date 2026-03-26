import {
  Box,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { PomodoroActiveNotice } from '../components/PomodoroActiveNotice'
import { getBlockSiteStorage } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import AddOrSearchBlockedSite from './AddOrSearchBlockedSite'
import BlockedSitesList from './BlockedSitesList'
import TakeABreakAlert from './take-a-break/TakeABreakAlert'

const blockedSiteStorage = getBlockSiteStorage()

export default function () {
  const { refetchSchema, enabledBlocking, breakUntil, pomodoro } =
    useBlockedSites()

  async function onSiteBlockingToggle(checked: boolean) {
    await blockedSiteStorage.toggleSitesBlock(checked)
    await refetchSchema()
  }

  return (
    <BlockedSitesSection
      enableBlocking={enabledBlocking}
      breakUntil={breakUntil}
      pomodoroActive={pomodoro.isActive}
      toggleSitesBlocking={onSiteBlockingToggle}
    />
  )
}

export function BlockedSitesSection(props: {
  enableBlocking: boolean
  breakUntil?: string
  pomodoroActive: boolean
  toggleSitesBlocking: (enable: boolean) => Promise<void>
}) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Blocked sites</Typography>
        <Typography color="text.secondary" mt={1} variant="body2">
          Add websites to your list, search existing entries, and control
          whether blocking is active right now.
        </Typography>
      </Box>
      <Box>
        <TakeABreakAlert breakUntil={props.breakUntil} />
      </Box>
      {props.pomodoroActive && (
        <PomodoroActiveNotice
          title="Pomodoro is active"
          description="Pomodoro currently controls website blocking, so the toggle below is temporarily unavailable."
        />
      )}
      <Paper sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="subtitle1">Blocking status</Typography>
            <Typography color="text.secondary" variant="body2">
              {props.enableBlocking
                ? 'Distracting sites will be blocked when rules apply.'
                : 'Blocking is paused until you re-enable it.'}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={props.enableBlocking}
                disabled={props.pomodoroActive}
                onChange={async (_event, checked) => {
                  await props.toggleSitesBlocking(checked)
                }}
              />
            }
            label={<Typography>Enable site blocking</Typography>}
          />
        </Stack>
      </Paper>
      <Box>
        <AddOrSearchBlockedSite />
        <Box sx={{ mt: 2.5 }}>
          <BlockedSitesList />
        </Box>
      </Box>
    </Stack>
  )
}

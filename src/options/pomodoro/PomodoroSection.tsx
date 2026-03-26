import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { PomodoroStatus } from '../../components/PomodoroStatus'
import { getBlockSiteStorage } from '../../domain/block-site'
import { useBlockedSites } from '../../providers/BlockedSitesProvider'

function sanitizeDuration(value: string, fallback: number) {
  const nextValue = Number.parseInt(value, 10)
  if (Number.isNaN(nextValue) || nextValue <= 0) {
    return fallback
  }
  return nextValue
}

export default function PomodoroSection() {
  const storage = getBlockSiteStorage()
  const { enqueueSnackbar } = useSnackbar()
  const { pomodoro, refetchSchema } = useBlockedSites()
  const [focusDuration, setFocusDuration] = useState(
    String(pomodoro.focusDurationMinutes)
  )
  const [breakDuration, setBreakDuration] = useState(
    String(pomodoro.breakDurationMinutes)
  )

  useEffect(() => {
    setFocusDuration(String(pomodoro.focusDurationMinutes))
    setBreakDuration(String(pomodoro.breakDurationMinutes))
  }, [pomodoro.breakDurationMinutes, pomodoro.focusDurationMinutes])

  async function saveDurations() {
    const focusDurationMinutes = sanitizeDuration(
      focusDuration,
      pomodoro.focusDurationMinutes
    )
    const breakDurationMinutes = sanitizeDuration(
      breakDuration,
      pomodoro.breakDurationMinutes
    )

    await storage.updatePomodoroDurations({
      focusDurationMinutes,
      breakDurationMinutes,
    })
    await refetchSchema()
    enqueueSnackbar('Pomodoro durations updated', { variant: 'success' })
  }

  async function startPomodoro() {
    await saveDurations()
    await storage.startPomodoro()
    await refetchSchema()
    enqueueSnackbar('Pomodoro started', { variant: 'success' })
  }

  async function stopPomodoro() {
    await storage.stopPomodoro()
    await refetchSchema()
    enqueueSnackbar('Pomodoro stopped', { variant: 'success' })
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Pomodoro</Typography>
        <Typography color="text.secondary" mt={1} variant="body2">
          Alternate between timed focus sessions that block distracting sites
          and short breaks that temporarily unblock them.
        </Typography>
      </Box>
      <PomodoroStatus pomodoro={pomodoro} />
      <Card>
        <CardContent>
          <Typography component="p" color="text.secondary" variant="caption">
            Set how long each focus and break session lasts, then start the
            timer.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
            <TextField
              label="Focus duration (minutes)"
              type="number"
              value={focusDuration}
              onChange={(event) => {
                setFocusDuration(event.target.value)
              }}
              inputProps={{ min: 1 }}
              fullWidth
            />
            <TextField
              label="Break duration (minutes)"
              type="number"
              value={breakDuration}
              onChange={(event) => {
                setBreakDuration(event.target.value)
              }}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2 }}>
          <Button onClick={saveDurations}>Save durations</Button>
          {pomodoro.isActive ? (
            <Button variant="contained" onClick={stopPomodoro}>
              Stop pomodoro
            </Button>
          ) : (
            <Button variant="contained" onClick={startPomodoro}>
              Start pomodoro
            </Button>
          )}
        </CardActions>
      </Card>
    </Stack>
  )
}

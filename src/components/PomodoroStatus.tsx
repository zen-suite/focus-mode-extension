import { Alert, Box, Typography } from '@mui/material'
import { LocalCafeOutlined, PlayArrow } from '@mui/icons-material'
import { useMemo } from 'react'
import { PomodoroPhase, type IPomodoroState } from '../domain/block-site'
import { useCountdown } from '../hooks/useCountdown'

function formatMinutes(minutes: number) {
  return `${minutes} min`
}

function formatCountdown(countdown: number) {
  return `${Math.floor(countdown / 60)}m ${countdown % 60}s`
}

function getPhaseLabel(phase: PomodoroPhase) {
  return phase === PomodoroPhase.FOCUS ? 'Focus' : 'Break'
}

export function PomodoroStatus(props: {
  pomodoro: IPomodoroState
  inactiveMessage?: string
}) {
  const countdown = useCountdown(props.pomodoro.phaseEndsAt)
  const phaseLabel = useMemo(() => {
    return getPhaseLabel(props.pomodoro.phase)
  }, [props.pomodoro.phase])

  if (!props.pomodoro.isActive) {
    return (
      <Alert severity="info">
        <Box>
          <Typography variant="subtitle2">Pomodoro is off</Typography>
          <Typography variant="body2">
            {props.inactiveMessage ??
              `Focus ${formatMinutes(
                props.pomodoro.focusDurationMinutes
              )}, break ${formatMinutes(props.pomodoro.breakDurationMinutes)}.`}
          </Typography>
        </Box>
      </Alert>
    )
  }

  const isFocusPhase = props.pomodoro.phase === PomodoroPhase.FOCUS

  return (
    <Alert
      severity={isFocusPhase ? 'success' : 'warning'}
      icon={
        isFocusPhase ? (
          <PlayArrow fontSize="inherit" />
        ) : (
          <LocalCafeOutlined fontSize="inherit" />
        )
      }
    >
      <Box>
        <Typography variant="subtitle2">{phaseLabel} session</Typography>
        <Typography variant="body2">
          {formatCountdown(countdown)} remaining
        </Typography>
      </Box>
    </Alert>
  )
}

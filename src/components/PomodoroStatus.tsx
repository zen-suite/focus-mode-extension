import { Alert, Box, Typography } from '@mui/material'
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
        {props.inactiveMessage ??
          `Pomodoro is off. Focus ${formatMinutes(
            props.pomodoro.focusDurationMinutes
          )}, break ${formatMinutes(props.pomodoro.breakDurationMinutes)}.`}
      </Alert>
    )
  }

  return (
    <Alert
      severity={
        props.pomodoro.phase === PomodoroPhase.FOCUS ? 'warning' : 'success'
      }
    >
      <Box>
        <Typography fontWeight={700}>{phaseLabel} session</Typography>
        <Typography>{formatCountdown(countdown)} remaining</Typography>
      </Box>
    </Alert>
  )
}

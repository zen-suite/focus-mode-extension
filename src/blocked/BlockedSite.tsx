import { Box, Paper, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { PomodoroActiveNotice } from '../components/PomodoroActiveNotice'
import { PomodoroPhase } from '../domain/block-site'
import { useCountdown } from '../hooks/useCountdown'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import styles from './BlockedSite.module.css'

function formatCountdown(countdown: number) {
  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function BlockedSite() {
  const { pomodoro } = useBlockedSites()
  const countdown = useCountdown(pomodoro.phaseEndsAt)

  const pomodoroLabel = useMemo(() => {
    return pomodoro.phase === PomodoroPhase.FOCUS
      ? 'Focus session in progress'
      : 'Break session in progress'
  }, [pomodoro.phase])

  return (
    <div className={styles.page}>
      <div className={styles.background} />
      <Box className={styles.content}>
        <Paper className={styles.panel} elevation={0}>
          <Stack spacing={2}>
            <Typography className={styles.eyebrow} variant="overline">
              Focus Mode
            </Typography>
            <Typography variant="h3">This website is blocked</Typography>
            <Typography color="text.secondary" variant="body1">
              Stay on task and come back when your session allows it.
            </Typography>

            {pomodoro.isActive && (
              <Box className={styles.pomodoroPanel}>
                <PomodoroActiveNotice
                  title={pomodoroLabel}
                  countdown={formatCountdown(countdown)}
                  description="Pomodoro controls stay in the extension settings."
                />
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
    </div>
  )
}

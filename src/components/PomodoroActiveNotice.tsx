import { Alert, Stack, Typography } from '@mui/material'

interface PomodoroActiveNoticeProps {
  title: string
  description: string
  countdown?: string
}

export function PomodoroActiveNotice(props: PomodoroActiveNoticeProps) {
  return (
    <Alert severity="info">
      <Stack spacing={0.5}>
        <Typography variant="subtitle2">{props.title}</Typography>
        {props.countdown && (
          <Typography component="div" variant="h4">
            {props.countdown}
          </Typography>
        )}
        <Typography color="text.secondary" variant="body2">
          {props.description}
        </Typography>
      </Stack>
    </Alert>
  )
}

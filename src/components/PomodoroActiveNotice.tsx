import { Paper, Stack, Typography } from '@mui/material'

interface PomodoroActiveNoticeProps {
  title: string
  description: string
  countdown?: string
}

export function PomodoroActiveNotice(props: PomodoroActiveNoticeProps) {
  return (
    <Paper sx={{ px: 2, py: 1.75 }}>
      <Stack spacing={0.5}>
        <Typography variant="subtitle2">{props.title}</Typography>
        {props.countdown && (
          <Typography variant="h4">{props.countdown}</Typography>
        )}
        <Typography color="text.secondary" variant="body2">
          {props.description}
        </Typography>
      </Stack>
    </Paper>
  )
}

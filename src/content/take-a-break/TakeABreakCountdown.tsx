import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'

export default function TakeABreakCountdown(props: { countdown: number }) {
  const displayText = useMemo(() => {
    return `${Math.floor(props.countdown / 60)}m ${props.countdown % 60}s`
  }, [props.countdown])
  return (
    <Box>
      <Typography>Break time is almost up in:</Typography>
      <Box py={2}>
        <Typography variant="h5" color="white">
          {displayText}
        </Typography>
      </Box>
    </Box>
  )
}

import { Box, Typography } from '@mui/material'

export default function TakeABreakCountdown(props: { countdown: number }) {
  return (
    <Box>
      <Typography>Break time is almost up in:</Typography>
      <Box py={2}>
        <Typography variant="h4" color="white">
          {props.countdown} s
        </Typography>
      </Box>
    </Box>
  )
}

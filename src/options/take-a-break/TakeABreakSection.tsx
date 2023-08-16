import { Box, Typography } from '@mui/material'
import { TakeABreakItem } from './TakeABreakItem'
import { useSnackbar } from 'notistack'

export default function TakeABreakSection() {
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Box
      sx={{
        paddingY: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
        }}
        color="text.secondary"
      >
        This section contains configuration for taking a break. By taking a
        break, the extension will temporarily disable blocking for specified
        period of time and resume blocking after break is over.
      </Typography>
      <TakeABreakItem
        onSetBreakTime={(breakTime) => {
          enqueueSnackbar(
            `Website blocking will disable until ${breakTime.format('hh:mm A')}`,
            { variant: 'success' }
          )
        }}
      />
    </Box>
  )
}

import { Box, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { getBlockSiteStorage } from '../../domain/block-site'
import { HOUR_FORMAT } from '../../util/date'
import { TakeABreakItem } from './TakeABreakItem'

export default function TakeABreakSection() {
  const storage = getBlockSiteStorage()
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
          storage.setBreakTime(breakTime.toDate())
          enqueueSnackbar(
            `Website blocking will disable until ${breakTime.format(
              HOUR_FORMAT
            )}`,
            { variant: 'success' }
          )
        }}
      />
    </Box>
  )
}

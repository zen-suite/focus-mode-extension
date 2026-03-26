import { Box, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { getBlockSiteStorage } from '../../domain/block-site'
import { useBlockedSites } from '../../providers/BlockedSitesProvider'
import { HOUR_FORMAT } from '../../util/date'
import TakeABreakAlert from './TakeABreakAlert'
import { TakeABreakItem } from './TakeABreakItem'

export default function TakeABreakSection() {
  const storage = getBlockSiteStorage()
  const { enqueueSnackbar } = useSnackbar()
  const { breakUntil, pomodoro, refetchSchema } = useBlockedSites()
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Take a break</Typography>
        <Typography color="text.secondary" mt={1} variant="body2">
          Temporarily pause blocking until a set time. Blocking resumes
          automatically when the break ends.
        </Typography>
      </Box>
      <TakeABreakAlert breakUntil={breakUntil} />
      <TakeABreakItem
        disabled={pomodoro.isActive}
        onSetBreakTime={async (breakTime) => {
          await storage.setBreakTime(breakTime.toDate())
          await refetchSchema()
          enqueueSnackbar(
            `Website blocking will disable until ${breakTime.format(
              HOUR_FORMAT
            )}`,
            { variant: 'success' }
          )
        }}
      />
    </Stack>
  )
}

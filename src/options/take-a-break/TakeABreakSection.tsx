import { Box, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { getBlockSiteStorage } from '../../domain/block-site'
import { useBlockedSites } from '../../providers/BlockedSitesProvider'
import { HOUR_FORMAT } from '../../util/date'
import TakeABreakAlert from './TakeABreakAlert'
import { TakeABreakItem } from './TakeABreakItem'

export default function TakeABreakSection() {
  const storage = getBlockSiteStorage()
  const { enqueueSnackbar } = useSnackbar()
  const { breakUntil, refetchSchema } = useBlockedSites()
  return (
    <Box>
      <Box
        sx={{
          my: 2,
        }}
      >
        <TakeABreakAlert breakUntil={breakUntil} />
      </Box>
      <TakeABreakItem
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
    </Box>
  )
}

import {
  Box,
  FormControlLabel,
  FormHelperText,
  Switch,
  Typography,
} from '@mui/material'
import { getBlockSiteStorage } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import AddOrSearchBlockedSite from './AddOrSearchBlockedSite'
import BlockedSitesList from './BlockedSitesList'
import TakeABreakAlert from './take-a-break/TakeABreakAlert'

const blockedSiteStorage = getBlockSiteStorage()

export default function () {
  const { refetchSchema, enabledBlocking, breakUntil } = useBlockedSites()

  async function onSiteBlockingToggle(checked: boolean) {
    await blockedSiteStorage.toggleSitesBlock(checked)
    await refetchSchema()
  }

  return (
    <BlockedSitesSection
      enableBlocking={enabledBlocking}
      breakUntil={breakUntil}
      toggleSitesBlocking={onSiteBlockingToggle}
    />
  )
}

export function BlockedSitesSection(props: {
  enableBlocking: boolean
  breakUntil?: string
  toggleSitesBlocking: (enable: boolean) => Promise<void>
}) {
  return (
    <>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <TakeABreakAlert breakUntil={props.breakUntil} />
      </Box>
      <Box py={2}>
        <FormControlLabel
          control={
            <Switch
              checked={props.enableBlocking}
              onChange={async (_event, checked) => {
                await props.toggleSitesBlocking(checked)
              }}
            />
          }
          label={<Typography>Enable site blocking</Typography>}
        />
      </Box>
      <Box>
        <AddOrSearchBlockedSite />
        <Box
          style={{
            border: '0.5px solid gray',
            borderRadius: '10px',
          }}
        >
          <BlockedSitesList />
        </Box>
      </Box>
    </>
  )
}

import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import { getBlockSiteStorage } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import AddOrSearchBlockedSite from './AddOrSearchBlockedSite'
import BlockedSitesList from './BlockedSitesList'

const blockedSiteStorage = getBlockSiteStorage()

export default function () {
  const { refetchSchema, enabledBlocking } = useBlockedSites()

  async function onSiteBlockingToggle(checked: boolean) {
    await blockedSiteStorage.toggleSitesBlock(checked)
    await refetchSchema()
  }

  return (
    <BlockedSitesSection
      enableBlocking={enabledBlocking}
      toggleSitesBlocking={onSiteBlockingToggle}
    />
  )
}

export function BlockedSitesSection(props: {
  enableBlocking: boolean
  toggleSitesBlocking: (enable: boolean) => Promise<void>
}) {
  return (
    <>
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

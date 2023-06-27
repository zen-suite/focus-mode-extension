import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import { getBlockedSiteStorageInstance } from '../domain/block-site'
import { requestStoragePermission } from '../storage'
import AddOrSearchBlockedSite from './AddOrSearchBlockedSite'
import BlockedSitesList from './BlockedSitesList'

export default function BlockedSitesSection() {
  async function onSiteBlockingToggle(checked: boolean) {
    await requestStoragePermission()
    await getBlockedSiteStorageInstance().update('enableBlocking', checked)
  }

  return (
    <>
      <Box display="flex">
        <AddOrSearchBlockedSite />
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              onChange={async (_event, checked) => {
                await onSiteBlockingToggle(checked)
              }}
            />
          }
          label={
            <Typography variant="caption">Enable site blocking</Typography>
          }
        />
      </Box>
      <Box
        style={{
          border: '0.5px solid gray',
          borderRadius: '10px',
        }}
      >
        <BlockedSitesList />
      </Box>
    </>
  )
}

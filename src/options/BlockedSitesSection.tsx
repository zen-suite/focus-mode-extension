import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getBlockSiteStorage } from '../domain/block-site'
import AddOrSearchBlockedSite from './AddOrSearchBlockedSite'
import BlockedSitesList from './BlockedSitesList'

const blockedSiteStorage = getBlockSiteStorage()

export default function () {
  const [enableBlocking, setEnableBlocking] = useState<boolean>(true)

  useEffect(() => {
    async function loadEnableBlocking() {
      const enableBlocking = await blockedSiteStorage.getEnableBlocking()
      setEnableBlocking(enableBlocking ?? true)
    }
    loadEnableBlocking()
  }, [])

  async function onSiteBlockingToggle(checked: boolean) {
    await blockedSiteStorage.toggleSitesBlock(checked)
    setEnableBlocking(checked)

    if (checked) {
      await blockedSiteStorage.enableSitesBlock()
    } else {
      await blockedSiteStorage.disableSitesBlock()
    }
  }

  return (
    <BlockedSitesSection
      enableBlocking={enableBlocking}
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
      <Box display="flex">
        <AddOrSearchBlockedSite />
        <FormControlLabel
          control={
            <Switch
              checked={props.enableBlocking}
              onChange={async (_event, checked) => {
                await props.toggleSitesBlocking(checked)
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

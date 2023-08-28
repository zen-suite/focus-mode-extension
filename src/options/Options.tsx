import { Box, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { BlockedSitesProvider } from '../providers/BlockedSitesProvider'
import BlockedSitesSection from './BlockedSitesSection'
import styles from './Options.module.css'
import SettingsList from './SettingsList'
import { SettingTab } from './types'
import TakeABreakSection from './take-a-break/TakeABreakSection'

export default function Options(): JSX.Element {
  const [currentSettingTab, setSettingTab] = useState<SettingTab>(
    SettingTab.BLOCKED_SITES
  )

  const settingSection = useMemo(() => {
    switch (currentSettingTab) {
      case SettingTab.BLOCKED_SITES:
        return <BlockedSitesSection />
      case SettingTab.TAKE_A_BREAK:
        return <TakeABreakSection />
      default:
        return <></>
    }
  }, [currentSettingTab])

  return (
    <BlockedSitesProvider>
      <Typography
        variant="h6"
        paddingX={4}
        paddingY={2}
        borderBottom={1}
        borderColor="primary.dark"
      >
        Settings
      </Typography>
      <div className={styles.container}>
        <Box minWidth={300} borderRight={1} borderColor="primary.dark">
          <SettingsList
            currentTab={currentSettingTab}
            onTabSelected={setSettingTab}
          />
        </Box>
        <Box flexGrow={1} paddingX={4}>
          {settingSection}
        </Box>
      </div>
    </BlockedSitesProvider>
  )
}

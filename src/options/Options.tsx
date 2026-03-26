import { Box, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { BlockedSitesProvider } from '../providers/BlockedSitesProvider'
import BlockedSitesSection from './BlockedSitesSection'
import styles from './Options.module.css'
import SettingsList from './SettingsList'
import { SettingTab } from './types'
import PomodoroSection from './pomodoro/PomodoroSection'
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
      case SettingTab.POMODORO:
        return <PomodoroSection />
      default:
        return <></>
    }
  }, [currentSettingTab])

  return (
    <BlockedSitesProvider>
      <div className={styles.container}>
        <Box
          sx={{
            width: 320,
            borderRight: 1,
            borderColor: 'divider',
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography color="text.secondary" variant="overline">
                Focus Mode
              </Typography>
              <Typography variant="h4">Settings</Typography>
              <Typography color="text.secondary" mt={1} variant="body2">
                Keep the extension quiet, direct, and easy to adjust.
              </Typography>
            </Box>
            <Paper sx={{ p: 1 }}>
              <SettingsList
                currentTab={currentSettingTab}
                onTabSelected={setSettingTab}
              />
            </Paper>
          </Stack>
        </Box>
        <Box className={styles.content} sx={{ p: 4 }}>
          <Paper
            sx={{
              minHeight: '100%',
              p: 4,
              backgroundColor: 'background.paper',
            }}
          >
            {settingSection}
          </Paper>
        </Box>
      </div>
    </BlockedSitesProvider>
  )
}

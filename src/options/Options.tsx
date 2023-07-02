import { Box, Typography } from '@mui/material'
import { BlockedSitesProvider } from '../providers/BlockedSitesProvider'
import BlockedSitesSection from './BlockedSitesSection'
import styles from './Options.module.css'
import SettingsList from './SettingsList'

export default function Options(): JSX.Element {
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
          <SettingsList />
        </Box>
        <Box flexGrow={1} paddingX={4}>
          <BlockedSitesSection />
        </Box>
      </div>
    </BlockedSitesProvider>
  )
}

import { Typography } from '@mui/material'
import styles from './BlockedSite.module.css'

export default function BlockedSite() {
  return (
    <div>
      <div className={styles.background} />
      <Typography className={styles.headerBanner} variant="h4">
        This website is blocked
      </Typography>
    </div>
  )
}

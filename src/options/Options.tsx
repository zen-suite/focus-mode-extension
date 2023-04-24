import { Box, Container, Typography } from '@mui/material'
import { BlockedSitesProvider } from '../providers/BlockedSitesProvider'
import AddBlockedSite from './AddBlockedSite'
import BlockedSitesList from './BlockedSitesList'

export default function Options(): JSX.Element {
  return (
    <BlockedSitesProvider>
      <Container maxWidth="sm">
        <Typography variant="h6" marginY="15px">
          Settings
          <hr />
        </Typography>
        <Box>
          <AddBlockedSite />
          <div
            style={{
              border: '0.5px solid gray',
              borderRadius: '10px',
            }}
          >
            <BlockedSitesList />
          </div>
        </Box>
      </Container>
    </BlockedSitesProvider>
  )
}

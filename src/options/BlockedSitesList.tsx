import { Box, CircularProgress, List, Paper, Typography } from '@mui/material'
import { type IBlockedSite } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import BlockedSiteItem from './BlockedSiteItem'

interface IInjectedProps {
  blockedSites: IBlockedSite[] | undefined
  enabledBlocking: boolean
  loading: boolean
  refetchData: () => Promise<void>
}

export default function () {
  const queries = useBlockedSites()

  return <BlockedSitesList {...queries} refetchData={queries.refetchSchema} />
}

export function BlockedSitesList(props: IInjectedProps) {
  if (props.loading) {
    return (
      <Box py={4} textAlign="center">
        <CircularProgress />
      </Box>
    )
  }

  if (!props.blockedSites?.length && !props.loading) {
    return (
      <Paper sx={{ px: 2, py: 3, textAlign: 'center' }}>
        <Typography variant="subtitle2">
          You have not blocked any websites yet.
        </Typography>
        <Typography color="text.secondary" mt={1} variant="body2">
          Add a domain above to start filtering distractions.
        </Typography>
      </Paper>
    )
  }
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {!props.enabledBlocking && (
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
          paddingY={1.5}
        >
          You have <strong>disabled</strong> website blocking. Changes will not
          take effect.
        </Typography>
      )}
      <List
        sx={{
          opacity: props.enabledBlocking ? 1 : 0.5,
        }}
      >
        {props.blockedSites?.map((site) => {
          return (
            <BlockedSiteItem
              blockedSite={site}
              key={site.id}
              onBlockedSiteDeleted={async () => {
                await props.refetchData()
              }}
            />
          )
        })}
      </List>
    </Paper>
  )
}

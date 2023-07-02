import { Box, CircularProgress, List, Typography } from '@mui/material'
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
    return <CircularProgress />
  }

  if (!props.blockedSites?.length && !props.loading) {
    return (
      <Typography variant="subtitle2" padding="15px 10px">
        You have not blocked any websites yet.
      </Typography>
    )
  }
  return (
    <Box>
      {!props.enabledBlocking && (
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: 'center',
          }}
          paddingY={1}
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
    </Box>
  )
}

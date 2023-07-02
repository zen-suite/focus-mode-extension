import { CircularProgress, List, Typography } from '@mui/material'
import { type IBlockedSite } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import BlockedSiteItem from './BlockedSiteItem'

interface IInjectedProps {
  blockedSites: IBlockedSite[] | undefined
  loading: boolean
  refetchData: () => Promise<void>
}

export default function () {
  const queries = useBlockedSites()

  return (
    <BlockedSitesList {...queries} refetchData={queries.refetchSchema} />
  )
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
    <List>
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
  )
}

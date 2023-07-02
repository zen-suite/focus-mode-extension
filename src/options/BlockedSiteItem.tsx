import { Delete } from '@mui/icons-material'
import { IconButton, ListItem, ListItemText } from '@mui/material'
import {
  getBlockSiteStorage,
  type IBlockedSite
} from '../domain/block-site'

interface IProps {
  blockedSite: IBlockedSite
  onBlockedSiteDeleted: (blockedSite: IBlockedSite) => void
}

interface InjectedProps {
  onSiteBlocked: (blockedSite: IBlockedSite) => Promise<void>
}

export default function (props: IProps): JSX.Element {
  const onBlockedSiteDeleted = async (
    blockedSite: IBlockedSite
  ): Promise<void> => {
    await getBlockSiteStorage().removeBlockedSite(blockedSite.domain)
    props.onBlockedSiteDeleted(blockedSite)
  }

  return <BlockedSiteItem {...props} onSiteBlocked={onBlockedSiteDeleted} />
}

export function BlockedSiteItem(props: IProps & InjectedProps): JSX.Element {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="Remove blocked site"
          onClick={async () => {
            await props.onSiteBlocked(props.blockedSite)
          }}
        >
          <Delete />
        </IconButton>
      }
    >
      <ListItemText primary={props.blockedSite.domain} />
    </ListItem>
  )
}

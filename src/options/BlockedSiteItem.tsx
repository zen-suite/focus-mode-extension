import { Delete } from '@mui/icons-material'
import { IconButton, ListItem, ListItemText } from '@mui/material'
import { getBlockSiteStorage, type IBlockedSite } from '../domain/block-site'

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
      sx={{
        mb: 0.75,
        px: 2,
        py: 1,
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
      }}
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

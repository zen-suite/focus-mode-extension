import { Delete, Language } from '@mui/icons-material'
import { IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material'
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
        px: 2,
        py: 1,
        borderRadius: 1,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          '& .delete-btn': { opacity: 1 },
        },
      }}
      secondaryAction={
        <IconButton
          className="delete-btn"
          edge="end"
          size="small"
          disableRipple
          aria-label="Remove blocked site"
          onClick={async () => {
            await props.onSiteBlocked(props.blockedSite)
          }}
          sx={{
            opacity: 0,
            transition: 'opacity 0.15s',
            border: 'none',
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: 'transparent',
              border: 'none',
            },
            '&:focus-visible': { outline: 'none' },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      }
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <Language fontSize="small" sx={{ color: 'text.disabled' }} />
      </ListItemIcon>
      <ListItemText
        primary={props.blockedSite.domain}
        primaryTypographyProps={{
          variant: 'body2',
          sx: { fontWeight: 500, letterSpacing: '0.01em' },
        }}
      />
    </ListItem>
  )
}

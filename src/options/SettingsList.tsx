import { List, ListItem, ListItemButton } from '@mui/material'
import React from 'react'

export default function SettingsList(props: { className?: string }) {
  const SettingsListItem = (itemProps: React.PropsWithChildren<any>) => {
    return (
      <ListItem>
        <ListItemButton
          sx={{
            paddingX: 4,
            paddingY: 2,
          }}
        >
          {itemProps.children}
        </ListItemButton>
      </ListItem>
    )
  }
  return (
    <List className={props.className}>
      <SettingsListItem>Blocked sites</SettingsListItem>
    </List>
  )
}

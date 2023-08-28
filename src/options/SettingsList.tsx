import { List, ListItem, ListItemButton } from '@mui/material'
import React from 'react'
import { SettingTab } from './types'

export default function SettingsList(props: {
  className?: string
  currentTab: SettingTab
  onTabSelected: (setting: SettingTab) => void
}) {
  const SettingsListItem = (
    itemProps: React.PropsWithChildren<{ tab: SettingTab }>
  ) => {
    return (
      <ListItem>
        <ListItemButton
          onClick={() => {
            props.onTabSelected(itemProps.tab)
          }}
          selected={itemProps.tab === props.currentTab}
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
      <SettingsListItem tab={SettingTab.BLOCKED_SITES}>
        Blocked sites
      </SettingsListItem>
      <SettingsListItem tab={SettingTab.TAKE_A_BREAK}>
        Take a break
      </SettingsListItem>
    </List>
  )
}

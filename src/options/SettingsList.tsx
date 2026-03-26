import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { SettingTab } from './types'

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const SETTING_META: Record<SettingTab, { title: string; description: string }> =
  {
    [SettingTab.BLOCKED_SITES]: {
      title: 'Blocked sites',
      description: 'Manage your distraction list and blocking state.',
    },
    [SettingTab.TAKE_A_BREAK]: {
      title: 'Take a break',
      description: 'Temporarily pause blocking for a planned break.',
    },
    [SettingTab.POMODORO]: {
      title: 'Pomodoro',
      description: 'Run timed focus and break sessions.',
    },
  }

export default function SettingsList(props: {
  className?: string
  currentTab: SettingTab
  onTabSelected: (setting: SettingTab) => void
}) {
  const SettingsListItem = (itemProps: { tab: SettingTab }) => {
    return (
      <ListItem>
        <ListItemButton
          onClick={() => {
            props.onTabSelected(itemProps.tab)
          }}
          selected={itemProps.tab === props.currentTab}
          sx={{
            paddingX: 2,
            paddingY: 1.5,
          }}
        >
          <ListItemText
            primary={
              <Typography variant="subtitle2">
                {SETTING_META[itemProps.tab].title}
              </Typography>
            }
            secondary={SETTING_META[itemProps.tab].description}
          />
        </ListItemButton>
      </ListItem>
    )
  }
  return (
    <List className={props.className}>
      <SettingsListItem tab={SettingTab.BLOCKED_SITES} />
      <SettingsListItem tab={SettingTab.TAKE_A_BREAK} />
      <SettingsListItem tab={SettingTab.POMODORO} />
    </List>
  )
}

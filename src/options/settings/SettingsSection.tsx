import { Box, Paper, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getBlockSiteStorage } from '../../domain/block-site'
import { sanitizeFrictionDisablesPerLevel } from '../../domain/strong-friction/friction-level'
import { useBlockedSites } from '../../providers/BlockedSitesProvider'

const blockedSiteStorage = getBlockSiteStorage()

export default function SettingsSection() {
  const { enforceStrongFriction, frictionDisablesPerLevel, refetchSchema } =
    useBlockedSites()
  const [disablesPerLevelInput, setDisablesPerLevelInput] = useState(
    String(frictionDisablesPerLevel)
  )

  useEffect(() => {
    setDisablesPerLevelInput(String(frictionDisablesPerLevel))
  }, [frictionDisablesPerLevel])

  async function onFrictionToggle(checked: boolean) {
    await blockedSiteStorage.setEnforceStrongFriction(checked)
    await refetchSchema()
  }

  async function saveDisablesPerLevel() {
    const value = sanitizeFrictionDisablesPerLevel(
      disablesPerLevelInput,
      frictionDisablesPerLevel
    )
    setDisablesPerLevelInput(String(value))
    await blockedSiteStorage.setFrictionDisablesPerLevel(value)
    await refetchSchema()
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Settings</Typography>
        <Typography color="text.secondary" mt={1} variant="body2">
          Configure extension-wide behavior that applies across tabs.
        </Typography>
      </Box>
      <Paper sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle1">
                Enforce strong friction
              </Typography>
              <Typography color="text.secondary" variant="body2">
                When enabled, turning off site blocking requires solving
                arithmetic problems. Difficulty increases after a set number of
                successful disables.
              </Typography>
            </Box>
            <Switch
              checked={enforceStrongFriction}
              inputProps={{ 'aria-label': 'Enforce strong friction' }}
              onChange={async (_event, checked) => {
                await onFrictionToggle(checked)
              }}
            />
          </Stack>
          <Box>
            <Typography variant="subtitle2">
              Disables before level up
            </Typography>
            <Typography color="text.secondary" mb={1.5} variant="body2">
              How many times you must complete the friction challenge before
              another problem is added.
            </Typography>
            <TextField
              inputProps={{ min: 1 }}
              label="Successful disables per level"
              onBlur={saveDisablesPerLevel}
              onChange={(event) => {
                setDisablesPerLevelInput(event.target.value)
              }}
              onKeyDown={async (event) => {
                if (event.key === 'Enter') {
                  await saveDisablesPerLevel()
                }
              }}
              size="small"
              sx={{ maxWidth: 280 }}
              type="number"
              value={disablesPerLevelInput}
            />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  )
}

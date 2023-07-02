import { Box, TextField } from '@mui/material'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'
import { getBlockSiteStorage } from '../domain/block-site'
import { useDebounce } from '../hooks/useDebouce'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import {
  extractDomain,
  isValidHttpDomain,
  normalizeHttpUrl,
} from '../util/host'

interface IInnerProps {
  allowCreation: boolean
  onFetchSites: (value?: string) => void
}

export default () => {
  const { refetchBlockedSites, blockedSites } = useBlockedSites()
  return (
    <AddOrSearchBlockedSite
      onFetchSites={refetchBlockedSites}
      allowCreation={blockedSites.length === 0}
    />
  )
}

export function AddOrSearchBlockedSite({
  onFetchSites,
  allowCreation,
}: IInnerProps) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 100)

  useEffect(() => {
    onFetchSites(debouncedValue)
  }, [debouncedValue, onFetchSites])

  const isValueValid = useMemo(() => {
    return isValidHttpDomain(normalizeHttpUrl(value))
  }, [value])

  const showError = value.length > 0 && !isValueValid

  const canAddSite = isValueValid && allowCreation

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      async function addSite() {
        if (!isValueValid) {
          return
        }
        await getBlockSiteStorage().addBlockSite(
          extractDomain(normalizeHttpUrl(value))
        )
        onFetchSites(value)
        setValue('')
      }
      if (event.key.toLowerCase() !== 'enter' || !canAddSite) {
        return
      }
      addSite()
    },
    [canAddSite, isValueValid, onFetchSites, value]
  )

  const helperTextForAdding = useMemo(() => {
    if (!canAddSite) {
      return
    }
    return (
      <div>
        Press enter to add <strong>{value}</strong>
      </div>
    )
  }, [canAddSite, value])

  return (
    <Box
      sx={{
        display: 'flex',
        paddingY: '15px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          flex: 'auto',
          paddingRight: '10px',
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          size="small"
          placeholder="Type website to search or add"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
          }}
          onKeyDown={onKeyDown}
          helperText={
            showError
              ? 'Please enter valid domain to add website'
              : helperTextForAdding
          }
        />
      </Box>
    </Box>
  )
}

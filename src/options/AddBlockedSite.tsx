import { Add } from '@mui/icons-material'
import { Box, Button, FormHelperText, Input } from '@mui/material'
import { useMemo, useState } from 'react'
import { addBlockedSite } from '../domain/block-site'
import { useBlockedSites } from '../providers/BlockedSitesProvider'
import {
  extractDomain,
  isValidHttpDomain,
  normalizeHttpUrl,
} from '../util/host'

interface IInnerProps {
  onSiteAdded: (value: string) => void
}

export default () => {
  const { refetchBlockedSites } = useBlockedSites()
  return <AddBlockedSite onSiteAdded={refetchBlockedSites} />
}

export function AddBlockedSite(props: IInnerProps) {
  const [value, setValue] = useState('')

  const isValueValid = useMemo(() => {
    return isValidHttpDomain(normalizeHttpUrl(value))
  }, [value])

  async function addSite() {
    if (!isValueValid) {
      return
    }
    await addBlockedSite(extractDomain(normalizeHttpUrl(value)))
    props.onSiteAdded(value)
    setValue('')
  }

  const showError = value.length > 0 && !isValueValid

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
        <Input
          sx={{
            display: 'block',
          }}
          placeholder="Press enter to block domain"
          value={value}
          onKeyDown={(event) => {
            if (event.key.toLowerCase() !== 'enter') {
              return
            }
            addSite()
          }}
          onChange={(event) => {
            setValue(event.target.value)
          }}
          error={showError}
        />
        {showError && (
          <FormHelperText
            color="danger"
            sx={{
              color: 'error.main',
            }}
          >
            Please enter valid domain.
          </FormHelperText>
        )}
      </Box>
      <Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={!isValueValid}
          aria-disabled={!isValueValid}
          onClick={addSite}
        >
          Add site
        </Button>
      </Box>
    </Box>
  )
}

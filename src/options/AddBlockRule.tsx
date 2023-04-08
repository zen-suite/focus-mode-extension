import { Add } from '@mui/icons-material'
import { Box, Button, FormHelperText, Input } from '@mui/material'
import { useMemo, useState } from 'react'
import { addBlockRule } from '../block-rules'
import { useBlockRules } from '../providers/BlockRulesProvider'
import {
  extractDomain,
  isValidHttpDomain,
  normalizeHttpUrl,
} from '../util/host'

export default function AddBlockRule() {
  const { refetchRules } = useBlockRules()

  const [value, setValue] = useState('')

  const isValueValid = useMemo(() => {
    return isValidHttpDomain(normalizeHttpUrl(value))
  }, [value])

  async function addRule() {
    if (!isValueValid) {
      return
    }
    await addBlockRule(extractDomain(normalizeHttpUrl(value)))
    await refetchRules()
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
            addRule()
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
          onClick={addRule}
        >
          Add site
        </Button>
      </Box>
    </Box>
  )
}

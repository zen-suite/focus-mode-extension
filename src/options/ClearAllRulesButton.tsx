import { Button } from '@mui/material'
import { useBlockRules } from './BlockRulesProvider'
import { clearAllRules } from '../block-rules'

export default function ClearAllRulesButton() {
  const { refetchRules } = useBlockRules()
  async function onClick() {
    const isConfirm = confirm(
      'Are you sure you want to delete all rules?(This cannot be undone)'
    )
    if (!isConfirm) {
      return
    }
    await clearAllRules()
    await refetchRules()
  }
  return (
    <Button onClick={onClick} variant="contained" color="error">
      Clear all rules
    </Button>
  )
}

import { Button } from '@mui/material'
import { clearAllRules } from '../block-rules'
import BlockRulesList from './BlockRulesList'

export default function Options(): JSX.Element {
  return (
    <div>
      <h1>Hello from Zen mode options (With HOt Reload)</h1>
      <Button onClick={clearAllRules} variant="contained" color="error">
        Clear all rules
      </Button>
      <section
        style={{
          margin: '15px 0px',
        }}
      >
        <BlockRulesList />
      </section>
    </div>
  )
}

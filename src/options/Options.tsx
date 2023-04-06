import { Container, Typography } from '@mui/material'
import BlockRulesList from './BlockRulesList'
import { BlockRulesProvider } from '../providers/BlockRulesProvider'
import ClearAllRulesButton from './ClearAllRulesButton'

export default function Options(): JSX.Element {
  return (
    <BlockRulesProvider>
      <Container maxWidth="sm">
        <Typography variant="h6" marginBottom="30px">
          Settings
          <hr />
        </Typography>
        <section
          style={{
            margin: '15px 0px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              alignItems: 'center',
            }}
          >
            <Typography fontWeight="bold">Blocked sites</Typography>
            <ClearAllRulesButton />
          </div>
          <div
            style={{
              border: '0.5px solid gray',
              borderRadius: '10px',
            }}
          >
            <BlockRulesList />
          </div>
        </section>
      </Container>
    </BlockRulesProvider>
  )
}

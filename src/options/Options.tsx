import { Box, Container, Typography } from '@mui/material'
import { BlockRulesProvider } from '../providers/BlockRulesProvider'
import AddBlockRule from './AddBlockRule'
import BlockRulesList from './BlockRulesList'

export default function Options(): JSX.Element {
  return (
    <BlockRulesProvider>
      <Container maxWidth="sm">
        <Typography variant="h6" marginY="15px">
          Settings
          <hr />
        </Typography>
        <Box>
          <AddBlockRule />
          <div
            style={{
              border: '0.5px solid gray',
              borderRadius: '10px',
            }}
          >
            <BlockRulesList />
          </div>
        </Box>
      </Container>
    </BlockRulesProvider>
  )
}

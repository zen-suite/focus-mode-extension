import { CircularProgress, Container, List, Typography } from '@mui/material'
import { type IRule, getBlockRules } from '../block-rules'
import { useQuery } from '../hooks/useQuery'
import BlockRuleItem from './BlockRuleItem'

interface IInjectedProps {
  rules: IRule[] | undefined
  loading: boolean
  refetchData: () => Promise<void>
}

export default function () {
  const queries = useQuery(getBlockRules)

  return (
    <BlockRulesList
      rules={queries.data}
      {...queries}
      refetchData={queries.fetchData}
    />
  )
}

export function BlockRulesList(props: IInjectedProps) {
  if (props.loading) {
    return <CircularProgress />
  }

  if (!props.rules?.length && !props.loading) {
    return (
      <Typography variant="subtitle2">
        No rules found. Please add them first
      </Typography>
    )
  }
  return (
    <Container
      maxWidth="sm"
      sx={{
        margin: 0,
      }}
    >
      <List style={{ maxWidth: '500px' }}>
        {props.rules?.map((rule) => {
          return (
            <BlockRuleItem
              rule={rule}
              key={rule.id}
              onRuleDeleted={async () => {
                alert(`${rule.domain} has been removed successfully.`)
                await props.refetchData()
              }}
            />
          )
        })}
      </List>
    </Container>
  )
}

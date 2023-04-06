import { CircularProgress, List, Typography } from '@mui/material'
import { type IRule } from '../block-rules'
import BlockRuleItem from './BlockRuleItem'
import { useBlockRules } from '../providers/BlockRulesProvider'

interface IInjectedProps {
  rules: IRule[] | undefined
  loading: boolean
  refetchData: () => Promise<void>
}

export default function () {
  const queries = useBlockRules()

  return (
    <BlockRulesList
      rules={queries.blockRules}
      {...queries}
      refetchData={queries.refetchRules}
    />
  )
}

export function BlockRulesList(props: IInjectedProps) {
  if (props.loading) {
    return <CircularProgress />
  }

  if (!props.rules?.length && !props.loading) {
    return (
      <Typography variant="subtitle2" padding="10px">
        No rules found. Please add them first
      </Typography>
    )
  }
  return (
    <List>
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
  )
}

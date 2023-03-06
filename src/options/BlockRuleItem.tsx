import { DeleteForever } from '@mui/icons-material'
import { IconButton, ListItem, ListItemText } from '@mui/material'
import { removeBlockRule, type IRule } from '../block-rules'

interface IProps {
  rule: IRule
  onRuleDeleted: (rule: IRule) => void
}

interface InjectedProps {
  onRuleDelete: (rule: IRule) => Promise<void>
}

export default function (props: IProps): JSX.Element {
  const onRuleDelete = async (rule: IRule): Promise<void> => {
    await removeBlockRule(rule.domain)
    props.onRuleDeleted(rule)
  }

  return <BlockRuleItem {...props} onRuleDelete={onRuleDelete} />
}

export function BlockRuleItem(props: IProps & InjectedProps): JSX.Element {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="Remove blocked rule"
          onClick={async () => {
            await props.onRuleDelete(props.rule)
          }}
        >
          <DeleteForever />
        </IconButton>
      }
    >
      <ListItemText primary={props.rule.domain} />
    </ListItem>
  )
}

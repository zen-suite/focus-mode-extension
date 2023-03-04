export interface IRule {
  id: number
  domain: string
  actionType: chrome.declarativeNetRequest.RuleActionType
}

export const redirectExtensionPath = '/example.jpg'

export async function addBlockRule(domain: string): Promise<void> {
  const existingRule = await findBlockRuleByDomain(domain)
  const ruleId = await getNextRuleIndex()
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: ruleId,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            extensionPath: redirectExtensionPath,
          },
        },
        condition: {
          urlFilter: domain,
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      },
    ],
    removeRuleIds: existingRule ? [existingRule.id] : [],
  })
}

export async function getNextRuleIndex(): Promise<number> {
  const rules = await getBlockRules()
  if (!rules.length) {
    return 1
  }
  const lastRule = rules[rules.length - 1]
  return lastRule.id + 1
}

export async function findBlockRuleByDomain(
  domain: string
): Promise<IRule | undefined> {
  if (!domain.trim()) {
    return undefined
  }
  const rules = await getBlockRules()
  return rules.find((rule) => rule.domain === domain)
}

export async function removeBlockRule(domain: string): Promise<void> {
  const existingRule = await findBlockRuleByDomain(domain)
  if (!existingRule) {
    return
  }
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [existingRule.id],
  })
}

export async function getBlockRules(): Promise<IRule[]> {
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  return rules.map(transformChromeRuleToIRule)
}

export function transformChromeRuleToIRule(
  rule: chrome.declarativeNetRequest.Rule
): IRule {
  if (!rule.condition.urlFilter) {
    throw new Error('Undefined condition.urlFilter not allowed.')
  }
  return {
    id: rule.id,
    domain: rule.condition.urlFilter,
    actionType: rule.action.type,
  }
}

export async function clearAllRules(): Promise<void> {
  const ruleIds = (await getBlockRules()).map((rule) => rule.id)

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
  })
}

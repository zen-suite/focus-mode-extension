import { sortBy } from 'lodash'

export interface IBlockedSite {
  id: number
  domain: string
  actionType: chrome.declarativeNetRequest.RuleActionType
}

export const redirectExtensionPath = '/src/blocked/index.html'

export async function addBlockedSite(domain: string): Promise<void> {
  const existingBlockedSite = await findBlockedSiteByDomain(domain)
  const blockedSiteId = await getNextBlockedSiteIndex()
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: blockedSiteId,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            extensionPath: redirectExtensionPath,
          },
        },
        condition: {
          urlFilter: `||${domain}`,
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      },
    ],
    removeRuleIds: existingBlockedSite ? [existingBlockedSite.id] : [],
  })
}

export async function getNextBlockedSiteIndex(): Promise<number> {
  const blockedSites = await getBlockedSites()
  if (!blockedSites.length) {
    return 1
  }
  const lastBlockedSite = sortBy(blockedSites, (site) => site.id)[
    blockedSites.length - 1
  ]
  return lastBlockedSite.id + 1
}

export async function findBlockedSiteByDomain(
  domain: string
): Promise<IBlockedSite | undefined> {
  if (!domain.trim()) {
    return undefined
  }
  const blockedSites = await getBlockedSites()
  return blockedSites.find((site) => site.domain === domain)
}

export async function removeBlockedSite(domain: string): Promise<void> {
  const existingSite = await findBlockedSiteByDomain(domain)
  if (!existingSite) {
    return
  }
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [existingSite.id],
  })
}

export async function getBlockedSites(): Promise<IBlockedSite[]> {
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  return rules.map(transformChromeRuleToIBlockedSite)
}

export function transformChromeRuleToIBlockedSite(
  rule: chrome.declarativeNetRequest.Rule
): IBlockedSite {
  return {
    id: rule.id,
    domain:
      rule.condition.requestDomains?.[0] ??
      rule.condition.urlFilter?.replace('||', '') ??
      '',
    actionType: rule.action.type,
  }
}

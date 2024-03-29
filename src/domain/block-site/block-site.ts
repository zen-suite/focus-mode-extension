import { sortBy } from 'lodash'

export interface IBlockedSite {
  id: number
  domain: string
  actionType: chrome.declarativeNetRequest.RuleActionType
}

export const redirectExtensionPath = '/src/blocked/index.html'

function getBlockChromeRule(
  id: number,
  domain: string
): chrome.declarativeNetRequest.Rule {
  return {
    id,
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
  }
}

export async function addBlockedSite(domain: string): Promise<void> {
  const existingBlockedSites = await filterBlockedSitesByDomain(domain)
  const blockedSiteId = await getNextBlockedSiteIndex()
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [getBlockChromeRule(blockedSiteId, domain)],
    removeRuleIds: existingBlockedSites.map((site) => site.id),
  })
}

export async function batchAddBlockedSites(domains: string[]) {
  const allBlockedSites = await getBlockedSites()
  const existingSites = allBlockedSites.filter((blockedSite) =>
    domains.includes(blockedSite.domain)
  )
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [],
    removeRuleIds: existingSites.map((site) => site.id),
  })
  const nextBlockedSiteId = await getNextBlockedSiteIndex()
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: domains.map((domain, index) => {
      return getBlockChromeRule(nextBlockedSiteId + index, domain)
    }),
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

export async function filterBlockedSitesByDomain(
  domain: string
): Promise<IBlockedSite[]> {
  if (!domain.trim()) {
    return []
  }
  const blockedSites = await getBlockedSites()
  return blockedSites.filter((site) => site.domain === domain)
}

export async function removeBlockedSite(domain: string): Promise<void> {
  const existingSites = await filterBlockedSitesByDomain(domain)

  if (!existingSites) {
    return
  }
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingSites.map((site) => site.id),
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

import { getLogger, setLevel } from 'loglevel'

setLevel('DEBUG')

const logger = getLogger('service-worker')

chrome.declarativeNetRequest
  .updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            extensionPath: '/example.jpg',
          },
        },
        condition: {
          urlFilter: 'yahoo.com',
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      },
    ],
    removeRuleIds: [1],
  })
  .then(async () => {
    logger.debug(
      'added dynamic rules',
      await chrome.declarativeNetRequest.getDynamicRules()
    )
  })
  .catch((error) => {
    logger.error(error)
  })

export async function getHostDomain(): Promise<string | undefined> {
  const hostUrl = await getHostUrl()
  if (!hostUrl) {
    return
  }
  return new URL(hostUrl).hostname.replace('www.', '')
}

export async function getHostUrl(): Promise<string | undefined> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tabs?.[0].url) {
    return undefined
  }

  return tabs[0].url
}

export function isHttpProtocol(url: string | undefined): boolean {
  if (!url) {
    return false
  }
  const urlObj = new URL(url)
  return urlObj.protocol.startsWith('http')
}

export async function reloadHostTab(): Promise<void> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tabs?.[0].id) {
    return
  }
  await chrome.tabs.reload(tabs[0].id, {
    bypassCache: true,
  })
}

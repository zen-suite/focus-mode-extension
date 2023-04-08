import isValidDomain from 'is-valid-domain'

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

export function isValidHttpDomain(url: string) {
  try {
    // Check isHttpProtocol as well because isValidDomain returns false
    // if `url` contains protocol
    return isHttpProtocol(url) && isValidDomain(extractDomain(url))
  } catch {
    return isValidDomain(url)
  }
}

export function normalizeHttpUrl(url: string): string {
  const urlComps = url.split('://')
  if (urlComps.length <= 1) {
    return `http://${url}`
  }
  return url
}

export function extractDomain(url: string) {
  const urlObj = new URL(url)
  return urlObj.hostname
}

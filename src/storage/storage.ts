

export async function isStorageAllowed(): Promise<boolean> {
  return await chrome.permissions.request({
    permissions: ['storage'],
  })
}

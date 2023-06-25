export async function requestStoragePermission(): Promise<boolean> {
  return await chrome.permissions.request({
    permissions: ['storage'],
  })
}

export async function isStorageAllowed(): Promise<boolean> {
  const permissionResponse = await chrome.permissions.getAll()
  return (
    permissionResponse.permissions?.some(
      (permission) => permission === 'storage'
    ) ?? false
  )
}

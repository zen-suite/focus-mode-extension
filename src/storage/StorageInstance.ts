class StorageInstance<T extends { [key: string]: any }> {
  constructor(
    private readonly storageArea: chrome.storage.StorageArea,
    private readonly tableName: string,
    private readonly initialData?: T
  ) {}

  async set(data: T) {
    await this.storageArea.set({
      ...this.initialData,
      ...data,
    })
  }

  async get(): Promise<T> {
    return (await this.storageArea.get(this.tableName)) as T
  }
}

interface IInstanceMap<T extends { [key: string]: any }> {
  [key: string]: StorageInstance<T>
}

const instancesMap: IInstanceMap<any> = {}

export function getStorageInstance<T extends { [key: string]: any }>(
  tableName: string,
  initialData?: T
): StorageInstance<T> {
  if (instancesMap[tableName]) {
    return instancesMap[tableName]
  }
  const instance = new StorageInstance<T>(
    chrome.storage.local,
    tableName,
    initialData
  )
  instancesMap[tableName] = instance
  return instance
}

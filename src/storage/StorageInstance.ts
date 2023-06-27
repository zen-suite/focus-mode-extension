class StorageInstance<T extends { [key: string]: any }> {
  constructor(
    private readonly storageArea: chrome.storage.StorageArea,
    private readonly tableName: string,
    private readonly initialData?: T
  ) {}

  async set(data: T) {
    await this.storageArea.set({
      [this.tableName]: {
        ...this.initialData,
        ...data,
      },
    })
  }

  async update<K extends keyof T>(key: K, data: T[K]) {
    const existingData = await this.get()
    existingData[key] = data
    await this.set(existingData)
  }

  async get(): Promise<T> {
    const allData = await this.storageArea.get()
    return allData[this.tableName]
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

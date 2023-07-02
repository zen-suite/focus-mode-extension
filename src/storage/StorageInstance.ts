class StorageInstance<T extends { [key: string]: any }> {
  constructor(
    private readonly storageArea: chrome.storage.StorageArea,
    private readonly tableName: string,
    private readonly initialData?: T
  ) {}

  async set(data: T | undefined) {
    await this.storageArea.set({
      [this.tableName]: {
        ...this.initialData,
        ...data,
      },
    })
  }

  async update<K extends keyof T>(key: K, data: T[K]) {
    const existingData = await this.get()
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const updatedData = {
      ...existingData,
      [key]: data,
    } as T
    await this.set(updatedData)
  }

  async get(): Promise<T | undefined> {
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

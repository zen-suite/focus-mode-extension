import { useEffect, useState } from 'react'

export function useQuery<T = any>(queryFn: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  async function refetchData(): Promise<void> {
    try {
      setLoading(true)
      const fetchedData = await queryFn()
      setData(fetchedData)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetchData()
  }, [])

  return {
    data,
    loading,
    error,
    fetchData: refetchData,
  }
}

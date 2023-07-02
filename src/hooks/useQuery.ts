import { useCallback, useState } from 'react'

export function useQuery<T = any, FunctionArgs = any>(
  queryFn: (args?: FunctionArgs) => Promise<T>
) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const fetchData = useCallback(
    async (args?: FunctionArgs): Promise<void> => {
      try {
        setLoading(true)
        const fetchedData = await queryFn(args)
        setData(fetchedData)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    },
    [queryFn]
  )

  return {
    data,
    loading,
    error,
    fetchData,
  }
}

import React, { useCallback, useContext, useEffect } from 'react'
import { getBlockSiteStorage, type IBlockedSite } from '../domain/block-site'
import { useQuery } from '../hooks/useQuery'

interface IBlockedSitesContext {
  blockedSites: IBlockedSite[]
  enabledBlocking: boolean
  breakUntil?: string
  refetchSchema: (searchValue?: string) => Promise<void>
  error: ReturnType<typeof useQuery>['error']
  loading: boolean
}

const defaultContext: IBlockedSitesContext = {
  blockedSites: [],
  enabledBlocking: true,
  refetchSchema: async () => {},
  loading: false,
  error: undefined,
}

export const BlockedSitesContext =
  React.createContext<IBlockedSitesContext>(defaultContext)

export function BlockedSitesProvider(props: React.PropsWithChildren<any>) {
  const fetchBlockSitesSchema = useCallback(async (searchValue?: string) => {
    const schema = await getBlockSiteStorage().get()
    if (!searchValue?.trim()) {
      return schema
    }
    return {
      ...schema,
      blockedSites: schema.blockedSites.filter((blockedSite) =>
        blockedSite.domain.toLowerCase().startsWith(searchValue)
      ),
    }
  }, [])

  const {
    data: schema,
    error,
    fetchData,
    loading,
  } = useQuery(fetchBlockSitesSchema)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <BlockedSitesContext.Provider
      value={{
        blockedSites: schema?.blockedSites.slice().reverse() ?? [],
        enabledBlocking: schema?.enableBlocking ?? true,
        breakUntil: schema?.breakUntil,
        error,
        refetchSchema: fetchData,
        loading,
      }}
    >
      {props.children}
    </BlockedSitesContext.Provider>
  )
}

export function useBlockedSites() {
  return useContext(BlockedSitesContext)
}

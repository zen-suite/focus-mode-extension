import React, { useContext } from 'react'
import { getBlockedSites, type IBlockedSite } from '../domain/block-site'
import { useQuery } from '../hooks/useQuery'

interface IBlockedSitesContext {
  blockedSites: IBlockedSite[]
  refetchBlockedSites: () => Promise<void>
  error: ReturnType<typeof useQuery>['error']
  loading: boolean
}

const defaultContext: IBlockedSitesContext = {
  blockedSites: [],
  refetchBlockedSites: async () => {},
  loading: false,
  error: undefined,
}

export const BlockedSitesContext =
  React.createContext<IBlockedSitesContext>(defaultContext)

export function BlockedSitesProvider(props: React.PropsWithChildren<any>) {
  const { data, error, fetchData, loading } = useQuery(getBlockedSites)

  return (
    <BlockedSitesContext.Provider
      value={{
        blockedSites: data?.slice().reverse() ?? [],
        error,
        refetchBlockedSites: fetchData,
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

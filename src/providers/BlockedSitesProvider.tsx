import React, { useContext, useEffect, useState } from 'react'
import {
  getBlockedSites,
  searchBlockSites,
  type IBlockedSite,
} from '../domain/block-site'
import { useQuery } from '../hooks/useQuery'

interface IBlockedSitesContext {
  blockedSites: IBlockedSite[]
  refetchBlockedSites: (searchValue?: string) => Promise<void>
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
  const queryBlockSites = async (searchValue?: string) => {
    if (!searchValue?.trim()) {
      return await getBlockedSites()
    }
    return await searchBlockSites(searchValue)
  }
  const { data, error, fetchData, loading } = useQuery(queryBlockSites)

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

import React, { useContext } from 'react'
import { getBlockRules, type IRule } from '../block-rules'
import { useQuery } from '../hooks/useQuery'

interface IBlockRulesContext {
  blockRules: IRule[]
  refetchRules: () => Promise<void>
  error: ReturnType<typeof useQuery>['error']
  loading: boolean
}

const defaultContext: IBlockRulesContext = {
  blockRules: [],
  refetchRules: async () => {},
  loading: false,
  error: undefined,
}

export const BlockRulesContext =
  React.createContext<IBlockRulesContext>(defaultContext)

export function BlockRulesProvider(props: React.PropsWithChildren<any>) {
  const { data, error, fetchData, loading } = useQuery(getBlockRules)

  return (
    <BlockRulesContext.Provider
      value={{
        blockRules: data?.slice().reverse() ?? [],
        error,
        refetchRules: fetchData,
        loading,
      }}
    >
      {props.children}
    </BlockRulesContext.Provider>
  )
}

export function useBlockRules() {
  return useContext(BlockRulesContext)
}

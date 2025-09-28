import { useState, useCallback } from 'react'

interface LoadingStates {
  [key: string]: boolean
}

export function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }))
  }, [])

  const startLoading = useCallback(
    (key: string) => {
      setLoading(key, true)
    },
    [setLoading]
  )

  const stopLoading = useCallback(
    (key: string) => {
      setLoading(key, false)
    },
    [setLoading]
  )

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false
    },
    [loadingStates]
  )

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean)
  }, [loadingStates])

  const clearAllLoading = useCallback(() => {
    setLoadingStates({})
  }, [])

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    clearAllLoading,
  }
}

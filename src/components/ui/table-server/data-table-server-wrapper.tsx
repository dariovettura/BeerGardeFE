

import * as React from 'react'
import { useMemo, useCallback } from 'react'
import { type Table as TanstackTable } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableServer } from './data-table-server'
import { DataTableServerPagination } from './data-table-server-pagination'
import { DataTableServerToolbar } from './data-table-server-toolbar'

interface DataTableServerWrapperProps<TData>
  extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>
  loading?: boolean

  // State management
  searchParams: any
  onSearchParamsChange: (params: any) => void

  // Pagination props
  totalItems: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showTotalItems?: boolean

  // Table props
  actionBar?: React.ReactNode
  subRowHeader?: string
  renderRowDetails?: (row: TData) => React.ReactNode
  onRowClick?: (row: TData) => void
  showReset?: boolean
  skeletonProps?: {
    columnCount: number
    rowCount?: number
  }
  // Reset functionality
  onReset?: () => void
}

export function DataTableServerWrapper<TData>({
  table,
  loading = false,

  // State management
  searchParams,
  onSearchParamsChange,

  // Pagination props
  totalItems,
  pageSizeOptions,
  showPageSizeSelector,
  showTotalItems,

  // Table props
  actionBar,
  subRowHeader,
  renderRowDetails,
  onRowClick,
  showReset,
  skeletonProps,
  onReset,

  children,
  className,
  ...props
}: DataTableServerWrapperProps<TData>) {
  // Genera automaticamente i mapping dei filtri basandosi sui meta delle colonne
  const autoFilterMappings = useMemo(() => {
    if (!table) return {}

    const mappings: any = {}
    table.getAllColumns().forEach((column) => {
      const meta = column.columnDef.meta as any
      if (meta?.variant && meta?.apiField) {
        const columnId = column.id

        mappings[columnId] = {
          apiField: meta.apiField,
          transform: (value: any) => {
            // Handle single select - convert array to single value
            if (meta.variant === 'select' && Array.isArray(value) && value.length > 0) {
              return parseInt(value[0], 10)
            }
            // Handle multiSelect - join array values
            if (meta.variant === 'multiSelect' && Array.isArray(value)) {
              return value.join(',')
            }
            return value
          },
          reverseTransform: (value: any) => {
            // Handle single select - convert number to array for UI
            if (meta.variant === 'select' && typeof value === 'number') {
              return [value.toString()]
            }
            // Handle multiSelect - split string to array
            if (meta.variant === 'multiSelect' && typeof value === 'string') {
              return value.split(',').filter(Boolean)
            }
            return value
          },
        }
      }
    })

    return mappings
  }, [table])

  // Gestione automatica dei filtri
  const handleAutoFilters = useCallback(
    (autoFilters: { [key: string]: any }) => {
      if (!onSearchParamsChange) return

      const convertedFilters: any = {}

      // Converti i filtri automatici usando i mapping
      Object.entries(autoFilters).forEach(([uiKey, value]) => {
        const mapping = autoFilterMappings[uiKey] as any
        if (
          mapping &&
          value &&
          value !== '' &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          convertedFilters[mapping.apiField] = mapping.transform
            ? mapping.transform(value)
            : value
        }
      })

      // Gestione automatica dei searchParams
      onSearchParamsChange((prev: any) => {
        const newParams = { ...prev, page: 1 } // Reset to first page when filters change

        // Aggiungi solo i filtri che hanno valori
        Object.entries(convertedFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            newParams[key] = value
          }
        })

        // Rimuovi esplicitamente i campi che non sono più presenti
        const allApiFields = Object.values(autoFilterMappings).map(
          (mapping: any) => mapping.apiField
        )
        allApiFields.forEach((field) => {
          if (!(field in convertedFilters)) {
            delete newParams[field]
          }
        })

        return newParams
      })
    },
    [autoFilterMappings, onSearchParamsChange]
  )

  // Estrai i filtri automatici dal formato API
  const autoFilters = useMemo(() => {
    if (!searchParams) return {}

    const result: { [key: string]: any } = {}

    Object.entries(autoFilterMappings).forEach(([uiKey, mapping]) => {
      const value = searchParams[(mapping as any).apiField]
      if (value !== undefined && value !== null && value !== '') {
        result[uiKey] = (mapping as any).reverseTransform
          ? (mapping as any).reverseTransform(value)
          : value
      }
    })

    return result
  }, [autoFilterMappings, searchParams])

  const resetFilters = useCallback(() => {
    // Reset search params
    onSearchParamsChange?.({})
    
    // Reset auto filters UI state
    if (handleAutoFilters) {
      handleAutoFilters({})
    }
    
    // Call onReset for cache invalidation and refetch
    onReset?.()
  }, [onSearchParamsChange, handleAutoFilters, onReset])

  // Calcola se ci sono filtri attivi
  const hasActiveFilters = useMemo(() => {
    if (!searchParams) return false

    const activeFields = Object.keys(searchParams).filter(
      (key) =>
        !['page', 'limit', 'pageSize'].includes(key) &&
        searchParams[key] !== undefined &&
        searchParams[key] !== null &&
        searchParams[key] !== ''
    )

    return activeFields.length > 0
  }, [searchParams])

  return (
    <div
      style={{
        minHeight: '78vh',
      }}
      className={cn('flex flex-1 flex-col space-y-4', className)}
      {...props}
    >
      {/* Toolbar - sempre visibile */}
      <DataTableServerToolbar
        table={table}
        autoFilters={autoFilters}
        onAutoFiltersChange={handleAutoFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        showReset={showReset}
      >
        {children}
      </DataTableServerToolbar>

      {/* Table - con Suspense */}
      <DataTableServer
        table={table}
        loading={loading}
        actionBar={actionBar}
        subRowHeader={subRowHeader}
        renderRowDetails={renderRowDetails}
        onRowClick={onRowClick}
        skeletonProps={skeletonProps}
      />

      {/* Pagination - sempre visibile */}
      <DataTableServerPagination
        currentPage={searchParams.iPageNumber || 1}
        totalPages={Math.ceil(totalItems / (searchParams.iPageSize || 10))}
        pageSize={searchParams.iPageSize || 10}
        totalItems={totalItems}
        onPageChange={(page) =>
          onSearchParamsChange((prev: any) => ({ ...prev, iPageNumber: page }))
        }
        onPageSizeChange={(newPageSize) =>
          onSearchParamsChange((prev: any) => ({
            ...prev,
            iPageSize: newPageSize,
            iPageNumber: 1,
          }))
        }
        pageSizeOptions={pageSizeOptions}
        showPageSizeSelector={showPageSizeSelector}
        showTotalItems={showTotalItems}
      />
    </div>
  )
}

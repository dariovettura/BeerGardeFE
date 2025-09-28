

import * as React from 'react'
import { RefreshCw } from 'lucide-react'
import { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options'
import { DataTableServerFilters } from './data-table-server-filters'

interface DataTableServerToolbarProps<TData>
  extends React.ComponentProps<'div'> {
  table?: Table<TData>
  autoFilters?: { [key: string]: any }
  onAutoFiltersChange?: (filters: { [key: string]: any }) => void
  onReset?: () => void
  hasActiveFilters?: boolean
  showReset?: boolean
}

export function DataTableServerToolbar<TData>({
  table,
  autoFilters,
  onAutoFiltersChange,
  onReset,
  hasActiveFilters = false,
  showReset = true,
  children,
  className,
  ...props
}: DataTableServerToolbarProps<TData>) {
  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full flex-col sm:flex-row items-start pt-2 gap-2',
        className
      )}
      {...props}
    >
      {/* Container principale responsive */}
      <div className='flex w-full flex-col sm:flex-row items-start  gap-2'>
        {/* Sezione filtri e contenuto figlio */}
        <div className='flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0'>
          {/* Filtri automatici basati sui meta delle colonne */}
          {table && autoFilters !== undefined && onAutoFiltersChange && (
            <DataTableServerFilters
              table={table}
              filters={autoFilters}
              onFiltersChange={onAutoFiltersChange}
            />
          )}

          {/* Contenuto figlio */}
          {children}
        </div>

        {/* Sezione pulsanti - sempre in fondo su mobile, a destra su desktop */}
        <div className='flex  gap-1 sm:gap-2 flex-shrink-0 w-full sm:w-auto justify-end'>
          {/* Reset button - sempre attivo */}
          {onReset && showReset && (
            <Button
              aria-label='Reset filters and refresh data'
              variant='outline'
              size='sm'
              className='border-dashed h-8 px-2 '
              onClick={onReset}
            >
              <RefreshCw className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
              <span className='hidden sm:inline'>Reset</span>
            </Button>
          )}

          {/* View Options - sempre visibile se la table è fornita */}
          {table && <DataTableViewOptions table={table} />}
        </div>
      </div>
    </div>
  )
}

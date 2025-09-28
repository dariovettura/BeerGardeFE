

import * as React from 'react'
import { Column, Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { ControlledFacetedFilter } from './controlled-faceted-filter'

interface DataTableServerFiltersProps<TData> {
  table: Table<TData>
  filters?: { [key: string]: any }
  onFiltersChange?: (filters: { [key: string]: any }) => void
}

export function DataTableServerFilters<TData>({
  table,
  filters = {},
  onFiltersChange,
}: DataTableServerFiltersProps<TData>) {
  // Stato locale per i valori degli input
  const [inputValues, setInputValues] = React.useState<{
    [key: string]: string
  }>({})

  const handleFilterChange = React.useCallback(
    (key: string, value: any) => {
      // Aggiorna immediatamente il valore locale dell'input
      setInputValues((prev) => ({ ...prev, [key]: value }))

      if (onFiltersChange) {
        const newFilters = { ...filters }
        if (value !== undefined && value !== null && value !== '') {
          newFilters[key] = value
        } else {
          delete newFilters[key]
        }
        onFiltersChange(newFilters)
      }
    },
    [filters, onFiltersChange]
  )

  // Sincronizza i valori locali quando cambiano i filtri esterni (es. reset)
  React.useEffect(() => {
    const newInputValues: { [key: string]: string } = {}
    Object.keys(filters).forEach((key) => {
      newInputValues[key] = filters[key]
    })
    setInputValues(newInputValues)
  }, [filters])

  const renderFilter = React.useCallback(
    (column: Column<TData>) => {
      const columnMeta = column.columnDef.meta

      if (!columnMeta?.variant) return null

      const currentValue = filters[column.id]

      switch (columnMeta.variant) {
        case 'text':
          return (
            <div key={column.id} className='relative'>
              <Input
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={inputValues[column.id] ?? currentValue ?? ''}
                onChange={(event) =>
                  handleFilterChange(column.id, event.target.value)
                }
                className='h-8 w-full text-xs sm:text-sm'
              />
            </div>
          )

        case 'number':
          return (
            <div key={column.id} className='relative'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={inputValues[column.id] ?? currentValue ?? ''}
                onChange={(event) =>
                  handleFilterChange(column.id, event.target.value)
                }
                className='h-8 w-24 sm:w-[120px] text-xs sm:text-sm'
              />
              {columnMeta.unit && (
                <span className='bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-xs sm:text-sm'>
                  {columnMeta.unit}
                </span>
              )}
            </div>
          )

        case 'select':
        case 'multiSelect':
          return (
            <ControlledFacetedFilter
              key={column.id}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              value={
                Array.isArray(currentValue)
                  ? currentValue
                  : currentValue
                    ? [currentValue]
                    : []
              }
              onValueChange={(value) => handleFilterChange(column.id, value)}
              multiple={columnMeta.variant === 'multiSelect'}
            />
          )

        default:
          return null
      }
    },
    [filters, handleFilterChange]
  )

  // Filtra le colonne che hanno configurazioni meta per i filtri
  const filterableColumns = React.useMemo(() => {
    return table.getAllColumns().filter((column) => {
      const columnMeta = column.columnDef.meta
      return columnMeta?.variant && column.getCanFilter()
    })
  }, [table])

  return (
    <div className='flex flex-wrap items-center gap-1 sm:gap-2 w-full'>
      {filterableColumns.map(renderFilter)}
    </div>
  )
}



import * as React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { Column, Table } from '@tanstack/react-table'
import { FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter'
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter'
import { DataTableSliderFilter } from '@/components/ui/table/data-table-slider-filter'

interface DataTableToolbarCompactProps<TData>
  extends React.ComponentProps<'div'> {
  table: Table<TData>
}

export function DataTableToolbarCompact<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarCompactProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  )

  const onReset = React.useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  const activeFiltersCount = table.getState().columnFilters.length

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-center justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='h-8 gap-2'>
              <FilterIcon className='h-3 w-3' />
              Filtri
              {activeFiltersCount > 0 && (
                <Badge
                  variant='secondary'
                  className='ml-1 h-5 w-5 rounded-full p-0 text-xs'
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-80'>
            <DropdownMenuLabel>Filtri Attivi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className='space-y-2 p-2'>
              {columns.map((column) => (
                <DataTableToolbarFilterCompact
                  key={column.id}
                  column={column}
                />
              ))}
              {isFiltered && (
                <Button
                  aria-label='Reset filters'
                  variant='outline'
                  size='sm'
                  className='w-full border-dashed'
                  onClick={onReset}
                >
                  <Cross2Icon className='mr-2 h-3 w-3' />
                  Reset Filtri
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {children}
      </div>
    </div>
  )
}

interface DataTableToolbarFilterCompactProps<TData> {
  column: Column<TData>
}

function DataTableToolbarFilterCompact<TData>({
  column,
}: DataTableToolbarFilterCompactProps<TData>) {
  const columnMeta = column.columnDef.meta

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null

    switch (columnMeta.variant) {
      case 'text':
        return (
          <div className='space-y-1'>
            <label className='text-xs font-medium'>{columnMeta.label}</label>
            <Input
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className='h-8 w-full'
            />
          </div>
        )

      case 'number':
        return (
          <div className='space-y-1'>
            <label className='text-xs font-medium'>{columnMeta.label}</label>
            <div className='relative'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn('h-8 w-full', columnMeta.unit && 'pr-8')}
              />
              {columnMeta.unit && (
                <span className='bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-sm'>
                  {columnMeta.unit}
                </span>
              )}
            </div>
          </div>
        )

      case 'range':
        return (
          <div className='space-y-1'>
            <label className='text-xs font-medium'>{columnMeta.label}</label>
            <DataTableSliderFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          </div>
        )

      case 'date':
      case 'dateRange':
        return (
          <div className='space-y-1'>
            <label className='text-xs font-medium'>{columnMeta.label}</label>
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === 'dateRange'}
            />
          </div>
        )

      case 'select':
      case 'multiSelect':
        return (
          <div className='space-y-1'>
            <label className='text-xs font-medium'>{columnMeta.label}</label>
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === 'multiSelect'}
            />
          </div>
        )

      default:
        return null
    }
  }, [column, columnMeta])

  return onFilterRender()
}

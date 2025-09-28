

import { Table as TanstackTable } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>
}

const PAGE_SIZES = [10, 25, 50, 100]

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  return (
    <div className='bg-muted/50 flex items-center justify-between border-t px-2 py-2'>
      {/* Page size selector */}
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground text-sm'>Show</span>
        <select
          className='rounded border px-2 py-1 text-sm'
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Page info and controls */}
      <div className='flex items-center gap-4'>
        <button
          className='p-1'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <span className='text-sm'>
          {pageCount === 0 ? '0' : pageIndex + 1} of {pageCount}
        </span>
        <button
          className='p-1'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

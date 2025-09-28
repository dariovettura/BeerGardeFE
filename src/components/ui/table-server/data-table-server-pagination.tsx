

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTableServerPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showTotalItems?: boolean
}

const PAGE_SIZES = [10, 25, 50, 100]

export function DataTableServerPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZES,
  showPageSizeSelector = true,
  showTotalItems = true,
}: DataTableServerPaginationProps) {
 

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className=' flex items-center justify-between px-2 py-2'>
      {/* Page size selector */}
      {showPageSizeSelector && (
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-sm'>Show</span>
          <select
            className='rounded border px-2 text-sm'
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page info and controls */}
      <div className='flex items-center gap-4'>
        <button
          className='p-1'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <span className='text-sm'>
          {totalPages === 0 ? '0' : currentPage} of {totalPages}
        </span>
        <button
          className='p-1'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      {/* Total items info */}
      {showTotalItems && (
        <div className='text-muted-foreground text-sm'>
          {totalItems} Items
        </div>
      )}
    </div>
  )
}

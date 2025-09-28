import * as React from 'react'
import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
import { getCommonPinningStyles } from '@/lib/data-table'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/ui/table/data-table-pagination'

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>
  actionBar?: React.ReactNode
  subRowHeader?: string
  renderRowDetails?: (row: TData) => React.ReactNode
  onRowClick?: (row: TData) => void
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  subRowHeader,
  renderRowDetails,
  onRowClick,
}: DataTableProps<TData>) {
  return (
    <div
      style={{
        minHeight: '500px',
      }}
      className='flex flex-1 flex-col space-y-4'
    >
      {children}
      <div className='relative flex flex-1'>
        <div className='absolute inset-0 flex overflow-hidden rounded-lg border'>
          <ScrollArea className='h-full w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles({ column: header.column }),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => {
                    const isSubRow = row.depth > 0
                    const isFirstSubRow =
                      isSubRow &&
                      index > 0 &&
                      table.getRowModel().rows[index - 1].depth === 0
                    const isMainRow = row.depth === 0
                    const hasDetails = renderRowDetails && isMainRow

                    return (
                      <React.Fragment key={row.id}>
                        {/* Sub-row header */}
                        {isFirstSubRow && subRowHeader && (
                          <TableRow className='bg-muted/50'>
                            <TableCell
                              colSpan={table.getAllColumns().length}
                              className='text-muted-foreground px-4 py-2 text-sm font-medium'
                            >
                              {subRowHeader}
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Regular row */}
                        <TableRow
                          data-state={row.getIsSelected() && 'selected'}
                          className={cn(
                            isSubRow
                              ? 'bg-muted/30'
                              : onRowClick
                                ? 'hover:bg-accent/40 cursor-pointer'
                                : ''
                          )}
                          onClick={() => {
                            if (isMainRow && onRowClick) {
                              onRowClick(row.original)
                            }
                          }}
                          style={{
                            cursor:
                              isMainRow && onRowClick ? 'pointer' : undefined,
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles({
                                  column: cell.column,
                                }),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>

                        {/* Row Details */}
                        {hasDetails && (
                          <TableRow className='bg-muted/20'>
                            <TableCell
                              colSpan={table.getAllColumns().length}
                              className='px-4 py-3'
                            >
                              {renderRowDetails(row.original)}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  )
}

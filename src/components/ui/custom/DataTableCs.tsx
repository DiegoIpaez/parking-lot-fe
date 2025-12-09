'use client';

import { Inbox } from 'lucide-react';
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { PAGINATION } from '@/constants';
import { type PaginatedResponse } from '@/types';
import PaginationCs from '@/components/ui/custom/PaginationCs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TableCsProps<T> = {
  isLoading: boolean;
  columns: ColumnDef<T>[];
  data: PaginatedResponse<T>;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
};

const SkeletonRow = ({ columnsCount }: { columnsCount: number }) => {
  const widths = ['w-[20%]', 'w-[40%]', 'w-[60%]', 'w-[80%]'];

  return (
    <TableRow>
      {Array.from({ length: columnsCount }).map((_, index) => (
        <TableCell key={index}>
          <div
            className={`h-4 bg-muted rounded animate-pulse ${
              widths[index % widths.length]
            }`}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default function DataTableCs<T>({
  isLoading,
  data,
  columns,
  onPageChange,
  emptyMessage = 'No hay datos disponibles',
}: TableCsProps<T>) {
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {isLoading ? (
              Array.from({ length: PAGINATION.DEFAULT_PAGE_SIZE }).map(
                (_, index) => (
                  <SkeletonRow key={index} columnsCount={columns.length} />
                )
              )
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Inbox className="w-10 h-10" />
                    <p>{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationCs data={data} onPageChange={onPageChange} />
    </div>
  );
}

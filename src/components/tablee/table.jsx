"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "/src/components/ui/dropdown-menu";
import { Input } from "/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/src/components/ui/table";

export function DataTable({
  title,
  columns,
  data,
  filterCols, // Modifié pour accepter un tableau de colonnes à filtrer
  canAdd = false,
  setOpenModal,
  settypeOfSubmit,
}) {
  const [sorting, setSorting] = React.useState([{ id: 'id', desc: true }]); // Tri par défaut du plus récent au plus ancien
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({ id: false }); // Masquer la colonne id par défaut
  const [rowSelection, setRowSelection] = React.useState({});

  // Ajout de la colonne id pour le tri
  const extendedColumns = React.useMemo(() => [
    {
      id: 'id',
      header: 'رقم',
      accessorKey: 'id',
      enableSorting: true,
      sortDescFirst: true,
    },
    ...columns,
  ], [columns]);

  const table = useReactTable({
    data,
    columns: extendedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const buttonStyle = {
    backgroundColor: '#6B7280', // Couleur de fond
    color: '#fff', // Couleur du texte
    border: '1px solid #6B7280', // Bordure
    borderRadius: '4px', // Bords arrondis
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold', // Texte en gras
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s, border-color 0.3s', // Effets de transition
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="w-2/3 my-4 mx-auto text-center">
      <h1 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', paddingBottom: '10px', borderBottom: '2px solid #ccc' }}>
        {title}
      </h1>

      <div className="flex items-center py-4">
        <div className="flex-grow flex items-center space-x-4">
          {filterCols.map((col) => (
            <Input
              key={col}
              placeholder={`بحث  `}
              value={columnFilters.find(filter => filter.id === col)?.value || ""}
              onChange={(event) =>
                setColumnFilters((oldFilters) => [
                  ...oldFilters.filter(filter => filter.id !== col),
                  { id: col, value: event.target.value },
                ])
              }
              style={{
                padding: '8px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                width: '300px', // Vous pouvez ajuster la largeur selon vos besoins
              }}
            />
          ))}
          <DropdownMenu>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {canAdd && (
          <div className="ml-auto">
            <Button
              variant="solid"
              onClick={() => {
                setOpenModal(true);
                settypeOfSubmit("create");
              }}
              style={buttonStyle}
            >
              + إضافة {title.slice(0, -1)}
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table className="custom-table" style={{ background: '#f2f2f2', backgroundSize: '200% 100%', animation: 'backgroundAnimation 10s linear infinite' }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} style={{ backgroundColor: 'transparent' }}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Nunito, sans-serif',  textAlign: 'center',  }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ color: '#333' }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Column {
  header: string;
  accessorKey: string;
  cell?: (value: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  onEdit?: (id: string | number) => string;
}

export function DataTable({ columns, data, isLoading, onEdit }: DataTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.accessorKey}
                className="px-4 py-3 text-left text-sm font-medium text-surface-500 bg-surface-50"
              >
                {column.header}
              </th>
            ))}
            {onEdit && (
              <th className="px-4 py-3 text-right text-sm font-medium text-surface-500 bg-surface-50">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr 
              key={row.id || i}
              className="border-b border-surface-200 last:border-0"
            >
              {columns.map((column) => (
                <td 
                  key={column.accessorKey}
                  className="px-4 py-4 text-sm text-surface-900"
                >
                  {column.cell 
                    ? column.cell(row[column.accessorKey])
                    : row[column.accessorKey]
                  }
                </td>
              ))}
              {onEdit && (
                <td className="px-4 py-4 text-right">
                  <Link
                    to={onEdit(row.id)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Define strict types for our component props
export interface HeaderConfig {
  key: string;
  label: string;
  type: "string" | "number" | "date";
  sortable?: boolean;
  width?: string;
  formatter?: (value: any) => React.ReactNode;
}

export interface TableProps<T> {
  headersConfig: HeaderConfig[];
  data: T[];
  className?: string;
  emptyMessage?: string;
}

// Generic table component that accepts any data type
export default function TableComponent<T extends Record<string, any>>({
  headersConfig,
  data,
  className = "",
  emptyMessage = "No data available",
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Handle sorting
  const handleSort = (key: string) => {
    const header = headersConfig.find((h) => h.key === key);
    if (!header?.sortable) return;

    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === key) {
        return {
          key,
          direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Format cell value based on its type
  const formatValue = (value: any, header: HeaderConfig) => {
    if (header.formatter) {
      return header.formatter(value);
    }

    if (value === null || value === undefined) {
      return "-";
    }

    if (header.type === "date") {
      return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (header.type === "number") {
      return typeof value === "number" ? value.toLocaleString() : value;
    }

    return value;
  };

  // Apply sorting to data
  const sortedData = [...data];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const header = headersConfig.find((h) => h.key === sortConfig.key);
      if (!header) return 0;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle different data types for sorting
      if (header.type === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (header.type === "number") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // Render payment status with appropriate styling
  const renderPaymentStatus = (status: string) => {
    const statusClasses = {
      PAID: "bg-green-100 text-green-800 border-green-200",
      UNPAID: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      REFUNDED: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const statusClass =
      statusClasses[status as keyof typeof statusClasses] ||
      "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className={`w-full overflow-x-auto rounded-lg shadow ${className}`}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            {headersConfig.map((header) => (
              <th
                key={header.key}
                className={`px-6 py-3 ${
                  header.sortable ? "cursor-pointer select-none" : ""
                }`}
                style={{ width: header.width }}
                onClick={() => header.sortable && handleSort(header.key)}
              >
                <div className="flex items-center gap-1">
                  {header.label}
                  {header.sortable && (
                    <div className="flex flex-col ml-1">
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sortConfig?.key === header.key &&
                          sortConfig.direction === "asc"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === header.key &&
                          sortConfig.direction === "desc"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b hover:bg-gray-50 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {headersConfig.map((header) => (
                  <td
                    key={`${rowIndex}-${header.key}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {header.key === "payment_status"
                      ? renderPaymentStatus(row[header.key])
                      : formatValue(row[header.key], header)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headersConfig.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

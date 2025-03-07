import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StatusTag } from "./StatusTag";
import classNames from "classnames";

// Define types for component props
export interface HeaderConfig {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "status";
  sortable?: boolean;
  width?: string;
  formatter?: (value: any) => React.ReactNode;
}

interface TableProps<T> {
  headersConfig: HeaderConfig[];
  data: T[];
  className?: string;
  emptyMessage?: string;
}

// Generic table component that accepts any data type
export default function TableComponent<T extends Record<string, any>>({
  headersConfig,
  data,
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
    if (header.formatter) return header.formatter(value);
    if (value === null || value === undefined) return "-";

    if (header.type === "status") {
      console.log("value", value);
      return <StatusTag status={value} />;
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
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const header = headersConfig.find((h) => h.key === sortConfig.key);
      if (!header) return 0;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (header.type === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (header.type === "number") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      return aValue < bValue
        ? sortConfig.direction === "asc"
          ? -1
          : 1
        : aValue > bValue
        ? sortConfig.direction === "asc"
          ? 1
          : -1
        : 0;
    });
  }, [data, sortConfig, headersConfig]);

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            {headersConfig.map((header) => (
              <th
                key={header.key}
                className={classNames("px-6 py-3", {
                  "cursor-pointer select-none hover:text-blue-500":
                    header.sortable,
                })}
                style={{ width: header.width }}
                onClick={() => header.sortable && handleSort(header.key)}
              >
                <div className="flex items-center gap-1">
                  {header.label}
                  {header.sortable && (
                    <div className="flex flex-col ml-1">
                      <ChevronUp
                        className={classNames("h-3 w-3", {
                          "text-blue-600":
                            sortConfig?.key === header.key &&
                            sortConfig.direction === "asc",
                          "text-gray-400":
                            sortConfig?.key !== header.key ||
                            sortConfig.direction !== "asc",
                        })}
                      />
                      <ChevronDown
                        className={classNames("h-3 w-3 -mt-1", {
                          "text-blue-600":
                            sortConfig?.key === header.key &&
                            sortConfig.direction === "desc",
                          "text-gray-400":
                            sortConfig?.key !== header.key ||
                            sortConfig.direction !== "desc",
                        })}
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
                className={classNames(
                  "border-b hover:bg-gray-100 transition-colors",
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                )}
              >
                {headersConfig.map((header) => (
                  <td
                    key={`${rowIndex}-${header.key}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {formatValue(row[header.key], header)}
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

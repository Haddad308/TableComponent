import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface HeaderConfig {
  key: string;
  label: string;
  type: "number" | "string" | "date";
  width?: string;
  formatter?: (value: any) => React.ReactNode;
}

interface TableComponentProps<T> {
  data: T[];
  headersConfig: HeaderConfig[];
}

const defaultFormatters: Record<
  HeaderConfig["type"],
  (value: any) => React.ReactNode
> = {
  number: (value) => value.toLocaleString(),
  string: (value) => value,
  date: (value) =>
    new Date(value).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
};

const TableComponent = <T extends Record<string, any>>({
  data,
  headersConfig,
}: TableComponentProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

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

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortConfig, headersConfig]);

  const requestSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            {headersConfig.map((header) => (
              <th
                key={header.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                style={{ width: header.width }}
                onClick={() => requestSort(header.key)}
              >
                <div className="flex items-center">
                  {header.label}
                  {sortConfig?.key === header.key &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-2 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-2 w-4 h-4" />
                    ))}
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
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {headersConfig.map((header) => (
                  <td
                    key={`${rowIndex}-${header.key}`}
                    className="px-6 py-4 whitespace-nowrap"
                    style={{ width: header.width }}
                  >
                    {header.formatter
                      ? header.formatter(row[header.key])
                      : defaultFormatters[header.type](row[header.key])}
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
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium">No Data Available</span>
                  <p className="text-sm text-gray-400">
                    Try adjusting filters or check back later.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

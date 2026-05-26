import { Search, Plus } from "lucide-react";

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: Record<string, any>) => React.ReactNode;
  width?: string;
}

interface AdminTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  onCreateNew?: () => void;
  createLabel?: string;
  loading?: boolean;
  emptyMessage?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowActions?: (row: Record<string, any>) => React.ReactNode;
  headerExtra?: React.ReactNode;
}

export default function AdminTable({
  columns,
  data,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  onCreateNew,
  createLabel = "Create New",
  loading = false,
  emptyMessage = "No items found.",
  rowActions,
  headerExtra,
}: AdminTableProps) {
  const filtered = data.filter(
    (row) =>
      columns.some((col) => {
        const val = row[col.key];
        return (
          typeof val === "string" &&
          val.toLowerCase().includes(search.toLowerCase())
        );
      }) ||
      // also search pathTitle / moduleTitle helper fields
      (typeof row.pathTitle === "string" &&
        row.pathTitle.toLowerCase().includes(search.toLowerCase())) ||
      (typeof row.moduleTitle === "string" &&
        row.moduleTitle.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-[#1e2130] border border-[#2a2d3e] rounded-lg pl-9 pr-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]"
          />
        </div>
        {headerExtra}
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e8] text-white rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            {createLabel}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                {rowActions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (rowActions ? 1 : 0)}
                    className="px-4 py-12 text-center"
                  >
                    <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (rowActions ? 1 : 0)}
                    className="px-4 py-12 text-center text-sm text-[#64748b]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-[#2a2d3e] last:border-0 hover:bg-[#252840] transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-sm text-[#94a3b8]"
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3 text-right">
                        {rowActions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-2 border-t border-[#2a2d3e] text-xs text-[#64748b]">
            {filtered.length} of {data.length} records
          </div>
        )}
      </div>
    </div>
  );
}

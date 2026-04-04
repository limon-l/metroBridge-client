import Card from "./Card";

export default function DataTable({ columns, rows }) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-slate-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-4 text-small font-semibold text-neutral">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={`${rowIndex}-${row.id ?? "row"}`}
              className="border-b border-border transition-colors duration-200 hover:bg-slate-50/80 last:border-b-0">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-5 py-4 text-body text-gray-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Table({ 
  columns, 
  data,
  selectable = false,
  selectedRows = [],
  onSelectionChange, 
}) {
  const isSelected = (row) =>
    selectedRows.includes(row.id);

  const toggleRow = (row) => {
      if (!onSelectionChange) return;

      if (isSelected(row)) {
          onSelectionChange(
              selectedRows.filter(id => id !== row.id)
          );
      } else {
          onSelectionChange([
              ...selectedRows,
              row.id
          ]);
      }
    };
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            {selectable && (
                <th className="w-10 px-3 text-center">
                    <input type="checkbox" />
                </th>
            )}
            {columns.map((column, index) => (
              <th
                key={`${column.accessor}-${index}`}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
        {data.length > 0 ? (
            data.map((row, index) => (
            <tr
                key={index}
                className="border-t border-gray-200 hover:bg-slate-50 transition"
            >
                {selectable && (
                    <td className="w-10 px-3 text-center">
                        <input
                            type="checkbox"
                            checked={isSelected(row)}
                            onChange={() => toggleRow(row)}
                        />
                    </td>
                )}
                {columns.map((column, index) => (
                <td
                    key={`${column.accessor}-${index}`}
                    className="px-6 py-4 text-sm text-gray-700"
                >
                    {column.render
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]}
                </td>
                ))}
            </tr>
            ))
        ) : (
            <tr>
            <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
            >
                No data available.
            </td>
            </tr>
        )}
        </tbody>

      </table>
    </div>
  );
}

export default Table;
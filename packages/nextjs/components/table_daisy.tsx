// components/TableWithSearchAndSort.tsx
import { useState } from "react";

interface TableProps {
  data: any[];
  columns: string[];
  emptyTableMessage?: string;
}

const TableWithSearchAndSort: React.FC<TableProps> = ({ data, columns, emptyTableMessage = "Table is empty" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });

  const sortedData = data.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter(item =>
    Object.keys(item).some(key => item[key].toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="flex flex-col m-5">
      <input
        className="mb-4 p-2 border border-gray-300 rounded-md"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <table className="table-auto">
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column}
                className="px-4 py-2 cursor-pointer"
                onClick={() =>
                  setSortConfig({
                    key: column,
                    direction:
                      sortConfig.key === column && sortConfig.direction === "ascending" ? "descending" : "ascending",
                  })
                }
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                {columns.map(column => (
                  <td key={column} className="border px-4 py-2">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="border px-4 py-2 text-center">
                {emptyTableMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableWithSearchAndSort;

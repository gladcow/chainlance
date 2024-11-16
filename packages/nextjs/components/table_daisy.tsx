import React, { useState } from "react";
import { useFetchFields } from "./GetFieldsFromIds";
import { formatTableData } from "./utils";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface TableProps {
  initialData: any[];
  columns: string[];
  emptyTableMessage?: string;
  storage: Bee | undefined;
}

const TableWithSearchAndSort: React.FC<TableProps> = ({
  initialData,
  columns,
  emptyTableMessage = "Table is empty",
  storage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "",
    direction: "ascending",
  });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [project, setProject] = useState("");

  const titles = useFetchFields(initialData, storage, "title");
  const descriptions = useFetchFields(initialData, storage, "description");

  const { data: infoFull, isLoading: isInfoFullLoading } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined; isLoading: boolean };

  const filteredData = formatTableData(initialData, titles, searchTerm, sortConfig);

  const renderCellContent = (row: any, column: string) => {
    switch (column) {
      case "title":
        console.log(titles[row.id]);
        return titles[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "description":
        console.log(descriptions[row.id]);
        return descriptions[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      default:
        return row[column];
    }
  };

  return (
    <div className="flex flex-col m-5 max-w-20">
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
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  {columns.map(column => (
                    <td key={column} className="border px-4 py-2">
                      {renderCellContent(row, column)}
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setProject(row.id);
                        setExpandedRow(expandedRow === index ? null : index);
                      }}
                    >
                      {expandedRow === index ? "▲" : "▼"}
                    </button>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={columns.length + 1} className="border px-4 py-2">
                      {infoFull && !isInfoFullLoading ? (
                        <div className="flex content-evenly">
                          <div className="w-3/4">
                            <h3>Project Details:</h3>
                            <ul>
                              {infoFull.map((detail, detailIndex) => (
                                <li key={detailIndex} className="break-words">
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="w-1/4">
                            <div className="flex flex-col space-y-4">
                              <button className="btn btn-primary p-0">Button 1</button>
                              <button className="btn btn-secondary p-0">Button 2</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="border px-4 py-2 text-center">
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

// components/TableWithSearchAndSort.tsx
import React from "react";
import { useState } from "react";
import { ProjectTitleFromId } from "~~/components/ProjectTitleFromId";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface TableProps {
  data: any[];
  columns: string[];
  emptyTableMessage?: string;
  helia: any;
  heliaOnline: boolean;
}

const TableWithSearchAndSort: React.FC<TableProps> = ({
  data,
  columns,
  emptyTableMessage = "Table is empty",
  helia,
  heliaOnline,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [project, setProject] = useState("");
  const { data: infoFull } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined; isLoading: boolean };

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
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  {columns.map(column => (
                    <td key={column} className="border px-4 py-2">
                      <ProjectTitleFromId
                        projectId={row[column]}
                        helia={helia}
                        heliaOnline={heliaOnline}
                      ></ProjectTitleFromId>
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setProject(row.id);
                        console.log(row.id);
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
                      {infoFull && (
                        <div className="flex content-evenly">
                          <div className="w-3/4">
                            <h3>Project Details:</h3>
                            <ul>
                              {infoFull.map((detail, index) => (
                                <li key={index} className="break-words">
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

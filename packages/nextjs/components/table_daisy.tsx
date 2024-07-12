import React, { useEffect, useState } from "react";
import { useFetchTitles } from "./GetTitlesFromIds";
import { KuboRPCClient } from "kubo-rpc-client";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface TableProps {
  initialData: any[];
  columns: string[];
  emptyTableMessage?: string;
  ipfsNode: KuboRPCClient | undefined;
}

const TableWithSearchAndSort: React.FC<TableProps> = ({
  initialData,
  columns,
  emptyTableMessage = "Table is empty",
  ipfsNode,
}) => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "",
    direction: "ascending",
  });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [project, setProject] = useState("");
  const [ipfsOnline, setIpfsOnline] = useState(false);
  const titles = useFetchTitles(data, ipfsNode);

  const { data: infoFull, isLoading: isInfoFullLoading } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined; isLoading: boolean };

  useEffect(() => {
    setData(initialData); // Update local state when initialData changes
  }, [initialData]);

  const sortedData = [...data].sort((a, b) => {
    const aValue = titles[a.id] || "";
    const bValue = titles[b.id] || "";
    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter(item => {
    const title = titles[item.id] || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const init = async () => {
      const online = await ipfsNode?.isOnline();
      setIpfsOnline(online === undefined ? false : online);
    };
    init();
  }, [ipfsNode]);

  return (
    <div className="flex flex-col m-5 max-w-20">
      <input
        className="mb-4 p-2 border border-gray-300 rounded-md"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {ipfsOnline ? (
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
                        {titles[row[column]] || row[column]}
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
      ) : (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      )}
    </div>
  );
};

export default TableWithSearchAndSort;

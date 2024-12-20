import React, { useEffect, useState } from "react";
import { fetchProjectFieldFromId, useFetchFields } from "./GetFieldsFromIds";
import { placeBid } from "./placeBid";
import { formatTableData } from "./utils";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

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
  const [changeDescriptionFromId, setChangeDescriptionFromId] = useState("");
  const [description, setDescription] = useState("");
  const [waitingDes, setWaitingDes] = useState(true);
  const [bidIsBidded, setBidIsBidded] = useState(false);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setWaitingDes(false);
        const description = await fetchProjectFieldFromId(storage, changeDescriptionFromId, "description");
        setDescription(description);
        setWaitingDes(true);
      } catch (error) {
        console.error("Failed to fetch description:", error);
      }
    };

    if (changeDescriptionFromId) {
      fetchDescription();
    }
  }, [changeDescriptionFromId, storage]);

  const titles = useFetchFields(initialData, storage, "title");
  const timeSpans = useFetchFields(initialData, storage, "timeSpan");
  const prices = useFetchFields(initialData, storage, "price");

  const { data: infoFull, isLoading: isInfoFullLoading } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined; isLoading: boolean };

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "bidProject",
    args: [] as unknown as [string, string, bigint, number],
  });

  const filteredData = formatTableData(initialData, titles, searchTerm, sortConfig);

  const renderCellContent = (row: any, column: string) => {
    switch (column) {
      case "title":
        return titles[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "timeSpan":
        return timeSpans[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "price":
        return prices[row.id] || <span className="loading loading-spinner loading-sm"></span>;
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
                        setChangeDescriptionFromId(row.id);
                        setBidIsBidded(false);
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
                        <div className="flex flex-row justify-between items-start space-x-4">
                          <div className="w-3/4 space-y-2">
                            <h4 className="break-words leading-relaxed">
                              {waitingDes ? description : <span className="loading loading-spinner loading-sm"></span>}
                            </h4>
                          </div>
                          <div className="flex flex-col items-end space-y-4">
                            {!bidIsBidded ? (
                              <button
                                className="btn btn-primary p-2 w-20"
                                onClick={() => {
                                  placeBid(
                                    infoFull[0],
                                    titles[row.id],
                                    infoFull[7],
                                    infoFull[3],
                                    writeAsync,
                                    setBidIsBidded,
                                  );
                                  setBidIsBidded(true);
                                }}
                              >
                                Place Bid
                              </button>
                            ) : (
                              <button disabled className="btn btn-primary p-2 w-20">
                                Bid is placed
                              </button>
                            )}
                            <button className="btn btn-secondary p-2 w-20">Button 2</button>
                          </div>
                        </div>
                      ) : (
                        <span className="loading loading-spinner loading-sm"></span>
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

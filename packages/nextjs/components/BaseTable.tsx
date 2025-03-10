import React, { useState } from "react";

interface TableProps {
  renderFunction: any;
  sortRow: any[];
  projectSetter: React.Dispatch<React.SetStateAction<string>>;
  searchTermPair: any[];
  sortConfigPair: any[];
  columns: string[];
  description: string;
  emptyTableMessage?: string;
  buttons?: { id: string; name: string; onClick: (row: any) => void }[] | any[];
  status?: { bids_amount: number; state: string };
}

const BaseTable: React.FC<TableProps> = ({
  sortRow,
  renderFunction,
  columns,
  emptyTableMessage = "Table is empty",
  buttons,
  projectSetter,
  searchTermPair,
  sortConfigPair,
  description,
  status,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const tranc_description = description.substring(0, 300) + "...";

  return (
    <div className="flex flex-col m-5 max-w-20">
      <input
        className="mb-4 p-2 border border-gray-300 rounded-md"
        type="text"
        placeholder="Search..."
        value={searchTermPair[0]}
        onChange={e => searchTermPair[1](e.target.value)}
      />
      <table className="table-auto w-100 border-separate border-spacing-2">
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column}
                className="px-4 py-2 cursor-pointer"
                onClick={() =>
                  sortConfigPair[1]({
                    key: column,
                    direction:
                      sortConfigPair[0].key === column && sortConfigPair[0].direction === "ascending"
                        ? "descending"
                        : "ascending",
                  })
                }
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortRow.length > 0 ? (
            sortRow.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  {columns.map(column => (
                    <td key={column} className="border px-4 py-2">
                      {renderFunction(row, column)}
                    </td>
                  ))}
                  <td className="border px-4 py-2 text-right w-px">
                    <button
                      onClick={() => {
                        projectSetter(row.id);
                        setExpandedRow(expandedRow === index ? null : index);
                      }}
                      className="text-sm"
                    >
                      {expandedRow === index ? "▲" : "▼"}
                    </button>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={columns.length} className="border px-4 py-2">
                      {true ? (
                        <div className="flex flex-row justify-between items-start space-x-4">
                          <div className="w-3/4 space-y-2">
                            <h4 className="break-words leading-relaxed">
                              {description ? (
                                tranc_description
                              ) : (
                                <span className="loading loading-spinner loading-sm"></span>
                              )}
                            </h4>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex flex-col items-end">
                              {status ? (
                                <div className="flex flex-col items-end">
                                  <h4>Amount of bids: {status.bids_amount}</h4>
                                  <h4>State: {status.state}</h4>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="flex flex-row items-end space-x-4 justify-end">
                              {buttons ? (
                                buttons.map(button => (
                                  <button
                                    disabled={button.disabled ? button.disabled() : false}
                                    key={button.id}
                                    className="btn btn-primary p-2"
                                    onClick={() => button.onClick(row)}
                                  >
                                    {button.disabled && button.disabled() ? "In Review" : button.name}
                                  </button>
                                ))
                              ) : (
                                <></>
                              )}
                            </div>
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

export default BaseTable;

import React, { useEffect, useState } from "react";
import { ClockIcon, CurrencyDollarIcon, SearchField } from "./BaseTableParts";
import { BlockieAvatar } from "./scaffold-eth";
import { calculateGradient, timeRetrive } from "./utils";
import { useTheme } from "next-themes";

interface TableProps {
  renderFunction: any;
  sortRow: any[];
  projectSetter: React.Dispatch<React.SetStateAction<string>>;
  searchTermPair: any[];
  description: string;
  emptyTableMessage?: string;
  buttons?: { id: string; name: string; onClick: (row: any) => void }[] | any[];
  status?: { bids_amount: number; state: string };
  currentRating?: number;
  ethAddress?: string;
}

const BaseTable: React.FC<TableProps> = ({
  sortRow,
  renderFunction,
  emptyTableMessage = "No projects found",
  buttons,
  projectSetter,
  searchTermPair,
  description,
  status,
  currentRating = 0,
  ethAddress = "0x000000000000000000000000000000000",
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-100 rounded-box">
      <SearchField searchTermPair={searchTermPair}></SearchField>
      {/* Project Cards */}
      <div className="grid grid-cols-1 gap-4">
        {sortRow.length > 0 ? (
          sortRow.map((row, index) => {
            const timeValue = Number(renderFunction(row, "timeSpan"));
            return (
              <div key={index} className="card bg-primary shadow-lg border border-base-300">
                <div className="card-body p-4">
                  {/* Main Row */}
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    {/* Left Section - Title and Description */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-primary-content mb-2">
                        {renderFunction(row, "title")
                          ? renderFunction(row, "title")
                          : renderFunction(row, "Title of a project")}
                      </h2>
                      <p className="text-primary-content/80">
                        {renderFunction(row, "short description")
                          ? renderFunction(row, "short description")
                          : "No short description"}
                      </p>
                    </div>

                    {/* Right Section with Gradient */}
                    <div
                      className="p-4 rounded-box w-full lg:w-72 transition-all duration-500 group"
                      style={{
                        background: calculateGradient(timeValue, mounted, resolvedTheme ? resolvedTheme : "dark"),
                        boxShadow: "0 4px 6px -1px var(--tw-shadow-color)",
                        ["--tw-shadow-color" as any]:
                          resolvedTheme === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="flex flex-col gap-3 text-primary-content">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-5 h-5" />
                          <span className="font-medium">{timeRetrive(renderFunction(row, "timeSpan"))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="w-5 h-5" />
                          <span className="font-medium">{renderFunction(row, "price")}xDai</span>
                        </div>
                        <button
                          className="btn btn-sm btn-accent mt-2 self-end"
                          onClick={() => {
                            projectSetter(row.id);
                            setExpandedRow(expandedRow === index ? null : index);
                          }}
                        >
                          {expandedRow === index ? "Collapse" : "Details"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {expandedRow === index && (
                    <div className="mt-4 pt-4 border-t border-success">
                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Left Column - Address, Rating, Buttons */}
                        <div className="flex flex-col gap-4 w-full lg:w-1/3">
                          <div className="flex items-center gap-4">
                            <BlockieAvatar address={ethAddress} size={60} />
                            <div className="space-y-2">
                              <p className="font-mono text-sm text-base-content/80 break-all">{ethAddress}</p>
                              <div className="rating rating-sm">
                                {[...Array(5)].map((_, i) => {
                                  const isChecked = currentRating > i + 0.25;
                                  return (
                                    <input
                                      key={i}
                                      type="radio"
                                      name="rating"
                                      className={`mask mask-star-2 ${isChecked ? "bg-orange-400" : "bg-gray-300"}`}
                                      checked={isChecked}
                                      readOnly
                                    />
                                  );
                                })}
                                <span className="ml-2 text-sm">({currentRating.toFixed(1)})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {buttons?.map(button => (
                              <button
                                key={button.id}
                                disabled={button.disabled?.()}
                                className={`btn btn-sm ${button.disabled?.() ? "btn-disabled" : "btn-secondary"}`}
                                onClick={() => button.onClick(row)}
                              >
                                {button.disabled?.() ? "In Review" : button.name}
                              </button>
                            ))}
                          </div>

                          {status && (
                            <div className="bg-base-200 p-3 rounded-box">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Total Bids:</span>
                                  <span className="badge badge-lg badge-primary">{status.bids_amount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Project Status:</span>
                                  <span
                                    className={`
                                badge badge-lg 
                                ${status.state === "Completed" && "badge-success"}
                                ${status.state === "In review" && "badge-warning"} 
                                ${status.state === "In work" && "badge-info"}
                                ${status.state === "Canceled" && "badge-error"}
                                ${!status.state && "badge-secondary"}
                                `}
                                  >
                                    {status.state}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Full Description */}
                        <div className="flex-1">
                          <p className="text-base-content leading-relaxed whitespace-pre-line">{description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 text-base-content/60">{emptyTableMessage}</div>
        )}
      </div>
    </div>
  );
};

export default BaseTable;

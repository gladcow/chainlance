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
  ratingButtons?: {
    id: string;
    name: string;
    onClick: (row: any) => void;
    color?: string;
    disabled?: boolean | ((row: any) => boolean);
  }[];
  emptyTableMessage?: string;
  buttons?:
    | {
        id: string;
        name: string;
        onClick: (row: any) => void;
      }[]
    | any[];
  status?: { bids_amount: number; state: string };
  currentRating?: number;
  ethAddress?: string;
  dataChanged?: any;
}

const BaseTable: React.FC<TableProps> = ({
  sortRow,
  renderFunction,
  emptyTableMessage = "No projects found",
  buttons,
  projectSetter,
  searchTermPair,
  description,
  ratingButtons = [],
  status,
  dataChanged,
  currentRating = 0,
  ethAddress = "0x000000000000000000000000000000000",
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    setExpandedRow(null);
  }, [dataChanged]);

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
                      <p className="text-primary-content/80 break-all">
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
                    <div className={`mt-4 pt-4 border-t ${currentRating >= 0 ? "border-success" : "border-error"}`}>
                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Left Column - Address, Rating, Buttons */}
                        <div className="flex flex-col gap-4 w-full lg:w-1/3">
                          <div className="flex items-center gap-4">
                            <BlockieAvatar address={ethAddress} size={60} />
                            <div className="space-y-2">
                              <p className="font-mono text-sm text-base-content/80 break-all">{ethAddress}</p>
                              <div className="rating rating-sm pb-3 flex items-center gap-2">
                                <h2 className="flex items-center">
                                  rates at
                                  <span className={`text mx-1 ${currentRating >= 0 ? "text-success" : "text-error"}`}>
                                    {currentRating}
                                  </span>
                                  {ratingButtons.length > 0 && (
                                    <div className="flex items-center gap-1 ml-3">
                                      {ratingButtons.map(button => (
                                        <button
                                          key={button.id}
                                          className={`btn btn-ghost btn-xs p-1 h-auto min-h-0 ${button.color}`}
                                          onClick={() => button.onClick(row)}
                                        >
                                          {button.id === "rate-good" ? (
                                            <svg
                                              className="w-6 h-6"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={1.5}
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                              />
                                            </svg>
                                          ) : (
                                            <svg
                                              className="w-6 h-6"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={1.5}
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 1.302-4.665c0-1.19-.232-2.333-.654-3.375Z"
                                              />
                                            </svg>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </h2>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {buttons?.map(button => {
                              if (button.gone?.() === true) return null;
                              return (
                                <button
                                  key={button.id}
                                  disabled={!!button.disabled?.()}
                                  className={`btn btn-sm ${button.disabled?.() ? "btn-disabled" : "btn-secondary"}`}
                                  onClick={() => button.onClick(row)}
                                >
                                  {button.state?.() === 3 && "Completed"}
                                  {button.state?.() === 2 && "In Review"}
                                  {button.state?.() === 1 && button.name}
                                  {button.state === undefined && button.name}
                                </button>
                              );
                            })}
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
                          <p className="text-base-content leading-relaxed break-all whitespace-pre-line">
                            {description}
                          </p>
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

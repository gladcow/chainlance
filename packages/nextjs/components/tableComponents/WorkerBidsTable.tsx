import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import { formatTableData, mapBidsToTitles } from "../utils";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const WorkerBidsTable: React.FC<any> = ({ data, storage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  const project_ids = useFetchFields(data, storage, "project_id");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const title_projects = useFetchFields(Object.values(project_ids), storage, "title");
  const bids_titles = mapBidsToTitles(title_projects, project_ids);
  const filteredData = formatTableData(data, bids_titles, searchTerm);

  const { data: bidInfo } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "bids",
    args: [project],
  }) as { data: any[] | undefined };

  const renderCellContent = (row: any, column: string) => {
    switch (column) {
      case "Title of a project":
        return bids_titles[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "timeSpan":
        return timeSpans[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "price":
        return prices[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      default:
        return row[column];
    }
  };

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const description = await fetchProjectFieldFromId(storage, project, "description");
        setDescription(description);
      } catch (error) {
        console.error("Failed to fetch description:", error);
      }
    };
    if (project) {
      fetchDescription();
    }
  }, [project, storage]);

  return (
    <>
      <BaseTable
        renderFunction={renderCellContent}
        sortRow={filteredData}
        ethAddress={bidInfo ? bidInfo[2] : "000000000000000000000"}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
      ></BaseTable>
    </>
  );
};

export default WorkerBidsTable;

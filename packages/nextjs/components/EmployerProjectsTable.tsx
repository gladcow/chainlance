import React, { useEffect, useState } from "react";
import BaseTable from "./BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "./GetFieldsFromIds";
import { formatTableData } from "./utils";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const EmployerProjectsTable: React.FC<any> = ({ data, storage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "",
    direction: "ascending",
  });
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  //   const { data: projectInfo } = useScaffoldContractRead({
  //     contractName: "ChainLance",
  //     functionName: "projects",
  //     args: [project],
  //   }) as { data: any[] | undefined };

  const { data: bidsOnProject } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectBids",
    args: [project],
  }) as { data: any[] | undefined };

  const titles = useFetchFields(data, storage, "title");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const buttons = [""];

  const filteredData = formatTableData(data, titles, searchTerm, sortConfig);

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

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const description = await fetchProjectFieldFromId(storage, project, "description");
        let bidsString = "";
        // need to make new component for description generation (small table for bids)
        if (bidsOnProject) {
          for (let index = 0; index < bidsOnProject.length; index++) {
            bidsString += bidsOnProject[index];
            bidsString += "\n";
            bidsString += await fetchProjectFieldFromId(storage, bidsOnProject[index], "description");
            bidsString += "\n";
          }
        }
        setDescription("My description:" + "\n" + description + "\n" + "Bids on this project:" + "\n" + bidsString);
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
        buttons={buttons}
        columns={["title", "timeSpan", "price"]}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        sortConfigPair={[sortConfig, setSortConfig]}
        description={description}
      ></BaseTable>
    </>
  );
};

export default EmployerProjectsTable;

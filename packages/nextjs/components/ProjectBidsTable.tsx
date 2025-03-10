import React, { useEffect, useState } from "react";
import BaseTable from "./BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "./GetFieldsFromIds";
import { formatTableData } from "./utils";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ProjectBidsTable: React.FC<any> = ({ data, storage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "",
    direction: "ascending",
  });
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "acceptBid",
    args: [] as unknown as [string, string],
  });

  const project_ids = useFetchFields(data, storage, "project_id");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const buttons = [
    {
      id: "accept",
      name: "Accept",
      onClick: (project: any) => {
        writeAsync({ args: [String(project_ids[project.id]), String(project.id)] });
      },
      onClose: () => {
        true;
      },
      disabled: (row: any) => {
        return 0 * row;
      },
    },
  ];

  const filteredData = formatTableData(data, project_ids, searchTerm, sortConfig);
  const renderCellContent = (row: any, column: string) => {
    switch (column) {
      case "project_id":
        return project_ids[row.id] || <span className="loading loading-spinner loading-sm"></span>;
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
        setDescription("My description:" + "\n" + description);
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
        columns={["project_id", "timeSpan", "price"]}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        sortConfigPair={[sortConfig, setSortConfig]}
        description={description}
      ></BaseTable>
    </>
  );
};

export default ProjectBidsTable;

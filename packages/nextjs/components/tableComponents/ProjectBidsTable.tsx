import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import { formatTableData, ProjectsTableProps } from "../Utils";
import { parseEther } from "viem";
import { useContractWrite } from "@/hooks/useContractWrite"
import { useContractRead } from "@/hooks/useContractRead"


const ProjectBidsTable: React.FC<ProjectsTableProps> = ({ data, storage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  const { write } = useContractWrite({
    functionName: "acceptBid",
    args: [] as unknown as [string, string],
  });

  const { data: bidInfo } = useContractRead({
    functionName: "bids",
    args: [project],
  }) as { data: string[] | undefined };

  const { data: workerRating } = useContractRead({
    functionName: "rates",
    args: [bidInfo && bidInfo[2]],
  }) as { data?: number };

  const project_ids = useFetchFields(data, storage, "project_id");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const short_descriptions = useFetchFields(data, storage, "short_description");

  const buttons = [
    {
      id: "accept",
      name: "Accept",
      onClick: (project: {id: string}) => {
        write({
          args: [String(project_ids[project.id]), String(project.id)],
          value: parseEther(prices[project.id]),
        });
      },
    },
  ] as 
  {
    id: string;
    name: string;
    onClick: (project?: { id: string }) => void;
    gone?: (row?: { id: string }) => boolean;
    disabled?: (row?: { id: string }) => boolean;
    state?: (row?: { id: string }) => number;
    onClose?: () => void
  }[] ;


  const filteredData = formatTableData(data, project_ids, searchTerm);
  const renderCellContent = (row: {id: string}, column: string) => {
    switch (column) {
      case "timeSpan":
        return timeSpans[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "price":
        return prices[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "short description":
        return short_descriptions[row.id] || "";
    }
  };

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const description = await fetchProjectFieldFromId(storage, project, "description");
        setDescription("Description:" + "\n" + description);
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
        currentRating={workerRating}
        dataChanged={data}
        ethAddress={bidInfo ? bidInfo[2] : "000000000000000000000"}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
      ></BaseTable>
    </>
  );
};

export default ProjectBidsTable;
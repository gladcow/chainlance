import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import { formatTableData } from "../utils";
import { parseEther } from "viem";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ProjectBidsTable: React.FC<any> = ({ data, storage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "acceptBid",
    args: [] as unknown as [string, string],
  });
  const { data: bidInfo } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "bids",
    args: [project],
  }) as { data: any[] | undefined };

  const { data: workerRating } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "rates",
    args: [bidInfo && bidInfo[2]],
  });

  const project_ids = useFetchFields(data, storage, "project_id");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const short_descriptions = useFetchFields(data, storage, "short_description");

  const buttons = [
    {
      id: "accept",
      name: "Accept",
      onClick: (project: any) => {
        writeAsync({
          args: [String(project_ids[project.id]), String(project.id)],
          value: parseEther(prices[project.id]),
        });
      },
      onClose: () => {
        true;
      },
      disabled: (row: any) => {
        return 0 * row;
      },
    },
  ];

  const filteredData = formatTableData(data, project_ids, searchTerm);
  const renderCellContent = (row: any, column: string) => {
    switch (column) {
      case "timeSpan":
        return timeSpans[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "price":
        return prices[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "short description":
        return short_descriptions[row.id] || "";
      default:
        return row[column];
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
        ethAddress={bidInfo ? bidInfo[2] : "000000000000000000000"}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
      ></BaseTable>
    </>
  );
};

export default ProjectBidsTable;

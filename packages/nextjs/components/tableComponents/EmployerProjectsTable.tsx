import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import { formatTableData } from "../utils";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const EmployerProjectsTable: React.FC<any> = ({ data, storage, setTab }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState({ bids_amount: 0, state: "0" });
  const [allButtons, setAllButtons] = useState([
    {
      id: "open",
      name: "Open",
      onClick: (id: any) => {
        setTab({ id: id.id, from: "employer" });
      },
      onClose: () => {
        true;
      },
      disabled: (row: any) => {
        return 0 * row;
      },
    },
  ]);

  const { data: projectInfo } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined };

  const { data: bidsOnProject } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectBids",
    args: [project],
  }) as { data: any[] | undefined };

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "acceptWork",
    args: [] as unknown as [string],
  });

  const titles = useFetchFields(data, storage, "title");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const short_descriptions = useFetchFields(data, storage, "short_description");

  const filteredData = formatTableData(data, titles, searchTerm);

  const renderCellContent = (row: any, column: string) => {
    switch (column) {
      case "title":
        return titles[row.id] || <span className="loading loading-spinner loading-sm"></span>;
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
    if (bidsOnProject && projectInfo) {
      const all_states = ["Open", "In work", "In review", "Completed", "Canceled"];

      setStatus({ bids_amount: bidsOnProject.length, state: all_states[Number(projectInfo[4])] });
      if (all_states[Number(projectInfo[4])] == "In review") {
        setAllButtons([
          {
            id: "open",
            name: "Open",
            onClick: (project: any) => {
              setTab({ id: project.id, from: "employer", state: projectInfo[4] });
            },
            onClose: () => {
              true;
            },
            disabled: (row: any) => {
              return 0 * row;
            },
          },
          {
            id: "accept",
            name: "Accept",
            onClick: (project: any) => {
              writeAsync({ args: [project.id] });
            },
            onClose: () => {
              true;
            },
            disabled: (row: any) => {
              return 0 * row;
            },
          },
        ]);
      } else {
        setAllButtons([
          {
            id: "open",
            name: "Open",
            onClick: (id: any) => {
              setTab({ id: id.id, from: "employer", state: projectInfo[4] });
            },
            onClose: () => {
              true;
            },
            disabled: (row: any) => {
              return 0 * row;
            },
          },
        ]);
      }
    }
  }, [projectInfo, bidsOnProject, setTab, writeAsync]);

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
        ethAddress={projectInfo ? projectInfo[2] : "000000000000000000000"}
        buttons={allButtons}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
        status={status}
      ></BaseTable>
    </>
  );
};

export default EmployerProjectsTable;

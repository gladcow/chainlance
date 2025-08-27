import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import { formatTableData, ProjectsTableProps } from "../Utils";
import { useContractRead } from "@/hooks/useContractRead"
import { useContractWrite } from "@/hooks/useContractWrite";



const EmployerProjectsTable: React.FC<ProjectsTableProps> = ({ data, storage, setTab }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState({ bids_amount: 0, state: "0" });
  const [ratingButtons, setRatingButtons] = useState<{
    id: string;
    color: string;
    onClick: () => void
  }[]>([]);
  const [allButtons, setAllButtons] = useState<
  {
    id: string;
    name: string;
    onClick: (project?: { id: string }) => void;
    gone?: (row?: { id: string }) => boolean;
    disabled?: (row?: { id: string }) => boolean;
    state?: (row?: { id: string }) => number;
    onClose?: () => void
  }[]
>([
    {
      id: "open",
      name: "Open",
      onClick: (project?: {id: string}) => {
        if (!project || !setTab) return 
        setTab({ id: project.id, from: "employer", state:"" });
      },
    },
  ]);

  const { data: projectInfo } = useContractRead({
    functionName: "projects",
    args: [project],
  }) as { data: string[] | undefined };

  const { data: bidsOnProject } = useContractRead({
    functionName: "listProjectBids",
    args: [project],
  }) as { data: string[] | undefined };

  const { write } = useContractWrite({
    functionName: "acceptWork",
    args: [] as unknown as [string],
  });

  const { write: rateWorker } = useContractWrite({
    functionName: "rateWorker",
    args: [] as unknown as [string, boolean],
  });

  const { data: workerRating } = useContractRead({
    functionName: "rates",
    args: [projectInfo && projectInfo[2]],
  }) as { data?: number};

  const { write: rejectWork } = useContractWrite({
    functionName: "rejectWork",
    args: [] as unknown as [string],
  });

  const { write: cancelProject } = useContractWrite({
    functionName: "cancelProject",
    args: [] as unknown as [string],
  });

  const handleCancelClick = () => {
    cancelProject({ args: [project] });
  };

  const titles = useFetchFields(data, storage, "title");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const short_descriptions = useFetchFields(data, storage, "short_description");

  const filteredData = formatTableData(data, titles, searchTerm);

  const renderCellContent = (row: {id: string}, column: string) => {
    switch (column) {
      case "title":
        return titles[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "timeSpan":
        return timeSpans[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "price":
        return prices[row.id] || <span className="loading loading-spinner loading-sm"></span>;
      case "short description":
        return short_descriptions[row.id] || "";
    }
  };

  useEffect(() => {
    if (projectInfo) {
      const all_states = ["Open", "In work", "In review", "Completed", "Canceled"];
      const currentState = all_states[Number(projectInfo[4])];
      const workerRated = projectInfo[9];

      if (currentState === "Completed" && !workerRated) {
        setRatingButtons([
          {
            id: "rate-good",
            color: "text-success hover:text-success/80",
            onClick: () => rateWorker({ args: [project, true] }),
          },
          {
            id: "rate-bad",
            color: "text-error hover:text-error/80",
            onClick: () => rateWorker({ args: [project, false] }),
          },
        ]);
      } else {
        setRatingButtons([]);
      }
    }
    if (bidsOnProject && projectInfo) {
      const all_states = ["Open", "In work", "In review", "Completed", "Canceled"];

      setStatus({ bids_amount: bidsOnProject.length, state: all_states[Number(projectInfo[4])] });
      if (all_states[Number(projectInfo[4])] == "In review") {
        setAllButtons([
          {
            id: "open",
            name: "Open",
            onClick: (project?: {id: string}) => {
              if (!project || !setTab) return 
              setTab({ id: project.id, from: "employer", state: projectInfo[4] });
            },
          },
          {
            id: "reject",
            name: "Reject",
            onClick: (project?: {id: string}) => {
              if (!project) return 
              rejectWork({ args: [project.id] });
            },
          },
          {
            id: "accept",
            name: "Accept",
            onClick: (project?: {id: string}) => {
              if (!project) return 
              write({ args: [project.id] });
            },
          },
        ]);
      } else if (all_states[Number(projectInfo[4])] == "Open") {
        setAllButtons([
          {
            id: "open",
            name: "Open",
            onClick: (project?: {id: string}) => {
              if (!project || !setTab) return 
              setTab({ id: project.id, from: "employer", state: projectInfo[4] });
            },
          },
          {
            id: "cancel",
            name: "Cancel",
            onClick: () => {
              handleCancelClick();
            },
          },
        ]);
      } else {
        setAllButtons([
          {
            id: "open",
            name: "Open",
            onClick: (project?: {id: string}) => {
              if (!project || !setTab) return 
              setTab({ id: project.id, from: "employer", state: projectInfo[4] });
            },
          },
        ]);
      }
    }
    // eslint-disable-next-line
  }, [projectInfo, bidsOnProject, setTab]);

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
        currentRating={workerRating}
        sortRow={filteredData}
        ethAddress={projectInfo ? projectInfo[2] : "000000000000000000000"}
        buttons={allButtons}
        projectSetter={setProject}
        ratingButtons={ratingButtons}
        dataChanged={data}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
        status={status}
      ></BaseTable>
    </>
  );
};

export default EmployerProjectsTable;
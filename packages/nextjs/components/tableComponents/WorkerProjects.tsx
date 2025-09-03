import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import SubCreateMenu from "../SubCreateMenu";
import SubmitWorkMenu from "../SubmitWorkMenu";
import { formatTableData, ProjectsTableProps } from "../Utils";
import { useContractRead } from "@/hooks/useContractRead";
import { useContractWrite } from "@/hooks/useContractWrite"


const WorkerProjects: React.FC<ProjectsTableProps> = ({ data, storage, activeTable }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [ratingButtons, setRatingButtons] = useState<{
    id: string;
    color: string;
    onClick: () => void
  }[]>([]);
  const [isSubmitMenuOpen, setIsSubmitMenuOpen] = useState(false);
  const [isSubCreateMenuOpen, setIsSubCreateMenuOpen] = useState(false);

  const handleSubmitClick = () => {
    setIsSubmitMenuOpen(true);
  };

  const closeSubmitMenu = () => {
    setIsSubmitMenuOpen(false);
  };

  const handleSubCreateClick = () => {
    setIsSubCreateMenuOpen(true);
  };

  const closeSubCreateMenu = () => {
    setIsSubCreateMenuOpen(false);
  };
  const { data: projectInfo } = useContractRead({
    functionName: "projects",
    args: [project],
  }) as { data: string[] | undefined };

  const { write: rateEmployer } = useContractWrite({
    functionName: "rateOwner",
    args: [] as unknown as [string, boolean],
  });

  const { data: employerRating } = useContractRead({
    functionName: "rates",
    args: [projectInfo && projectInfo[2]],
  }) as {data?: number};

  const { write: cancelWork } = useContractWrite({
    functionName: "cancelWork",
    args: [] as unknown as [string],
  });

  const titles = useFetchFields(data, storage, "title");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const short_descriptions = useFetchFields(data, storage, "short_description");
  const buttons = [
    {
      id: "submit",
      name: "Submit Work",
      onClick: () => {
        handleSubmitClick();
      },
      onClose: () => {
        closeSubmitMenu();
      },
      disabled: () => {
        return projectInfo ? Number(projectInfo[4])!= 1 : 0;
      },
      state: () => {
        return projectInfo ? Number(projectInfo[4]) : 0;
      },
    },
    {
      id: "subproject",
      name: "Create Subproject",
      onClick: () => {
        handleSubCreateClick();
      },
      onClose: () => {
        closeSubCreateMenu();
      },
      disabled: () => {
        return projectInfo ? Number(projectInfo[4]) != 1 : 0;
      },
      state: () => {
        return projectInfo ? Number(projectInfo[4]) : 0;
      },
      gone: () => {
        return projectInfo ? Number(projectInfo[4]) != 1 : true;
      },
    },
    {
      id: "cancelWork",
      name: "Cancel",
      onClick: () => {
        cancelWork({ args: [project] });
      },
      disabled: () => {
        return projectInfo ? Number(projectInfo[4]) != 1 : 0;
      },
      state: () => {
        return projectInfo ? Number(projectInfo[4]) : 0;
      },
      gone: () => {
        return projectInfo ? Number(projectInfo[4]) != 1 : true;
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
      const ownerRated = projectInfo[8];
      if (currentState === "Completed" && !ownerRated) {
        setRatingButtons([
          {
            id: "rate-good",
            color: "text-success hover:text-success/80",
            onClick: () => rateEmployer({ args: [project, true] }),
          },
          {
            id: "rate-bad",
            color: "text-error hover:text-error/80",
            onClick: () => rateEmployer({ args: [project, false] }),
          },
        ]);
      } else {
        setRatingButtons([]);
      }
    }
    // eslint-disable-next-line
  }, [projectInfo, project]);

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
        buttons={buttons}
        currentRating={employerRating}
        ethAddress={projectInfo ? projectInfo[2] : "000000000000000000000"}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        ratingButtons={ratingButtons}
        description={description}
        activeTable={activeTable}
      ></BaseTable>
      {isSubmitMenuOpen && <SubmitWorkMenu onClose={closeSubmitMenu} project_id={project}></SubmitWorkMenu>}
      {isSubCreateMenuOpen && (
        <SubCreateMenu
          onClose={closeSubCreateMenu}
          project_id={project}
          title={titles[project]}
          storage={storage}
        ></SubCreateMenu>
      )}
    </>
  );
};

export default WorkerProjects;
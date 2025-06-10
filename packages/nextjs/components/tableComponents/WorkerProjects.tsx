import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import SubmitWorkMenu from "../SubmitWorkMenu";
import { formatTableData } from "../utils";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const WorkerProjects: React.FC<any> = ({ data, storage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [ratingButtons, setRatingButtons] = useState<any[]>([]);

  const handleSubmitClick = () => {
    setIsSubmitMenuOpen(true);
  };

  const closeMenu = () => {
    setIsSubmitMenuOpen(false);
  };
  const { data: projectInfo } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined };

  const { writeAsync: rateEmployer } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "rateOwner",
    args: [] as unknown as [string, boolean],
  });

  const { data: employerRating } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "rates",
    args: [projectInfo && projectInfo[2]],
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
        closeMenu;
      },
      disabled: () => {
        return projectInfo ? projectInfo[4] != 1 : 0;
      },
      state: () => {
        return projectInfo ? projectInfo[4] : 0;
      },
    },
    {
      id: "subproject",
      name: "Create Subproject",
      onClick: () => {
        handleSubmitClick();
      },
      onClose: () => {
        closeMenu;
      },
      disabled: () => {
        return projectInfo ? projectInfo[4] != 1 : 0;
      },
      state: () => {
        return projectInfo ? projectInfo[4] : 0;
      },
      gone: () => {
        return projectInfo ? projectInfo[4] != 1 : true;
      },
    },
  ];

  const [isSubmitMenuOpen, setIsSubmitMenuOpen] = useState(false);

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
      ></BaseTable>
      {isSubmitMenuOpen && <SubmitWorkMenu onClose={closeMenu} project_id={project}></SubmitWorkMenu>}
    </>
  );
};

export default WorkerProjects;

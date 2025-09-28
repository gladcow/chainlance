import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import BidMenu from "../BidMenu";
import { formatTableData, ProjectsTableProps } from "../Utils";
import { useContractRead } from "@/hooks/useContractRead";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";



const OpenProjectsTable: React.FC<ProjectsTableProps> = ({ data, storage, setTab, activeTable, storageStamp, storageAddress }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [original_price, setOriginal_price] = useState("");
  const [original_time, setOriginal_time] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  const { data: projectInfo } = useContractRead({
    functionName: "projects",
    args: [project],
  }) as { data: string[] | undefined };

  const { data: ownerRating } = useContractRead<number | undefined>({
    functionName: "rates",
    args: [projectInfo && projectInfo[2]],
  }) as { data?: number};

  const handleBidClick = () => {
    setOriginal_price(prices[project]);
    setOriginal_time(timeSpans[project]);
    setIsBidMenuOpen(true);
  };

  const closeMenu = () => {
    setIsBidMenuOpen(false);
  };

  const titles = useFetchFields(data, storage, "title");
  const timeSpans = useFetchFields(data, storage, "timeSpan");
  const prices = useFetchFields(data, storage, "price");
  const short_descriptions = useFetchFields(data, storage, "short_description");

  const buttons = [
    {
      id: "open",
      name: "Open",
      onClick: (project: {id: string}) => {
        if (!setTab) return
        setTab({ id: project.id, from: "worker" });
      },
    },
    {
      id: "bid",
      name: "Bid",
      onClick: () => {
        handleBidClick();
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
  }[]


  const [isBidMenuOpen, setIsBidMenuOpen] = useState(false);

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
    const fetchDescription = async () => {
      try {
        const description = await fetchProjectFieldFromId(storage, project, "description");
        setDescription(description);
        
        const files = await fetchProjectFieldFromId(storage, project, "attachments");
        console.log(typeof(files))
        if (typeof(files)=='string') {
          setAttachments(files.split(",").map(f => f.trim()).filter(Boolean));
        } else {
          setAttachments([]);
        }
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
        currentRating={ownerRating}
        ethAddress={projectInfo ? projectInfo[2] : "000000000000000000000"}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
        activeTable={activeTable}
        attachments={attachments}
        storageAdress={storageAddress}
      ></BaseTable>
      {isBidMenuOpen && (
        <BidMenu
          storageStamp={storageStamp!}
          onClose={closeMenu}
          project_id={project}
          storage={storage}
          original_price={original_price}
          original_time={original_time}
        ></BidMenu>
      )}
    </>
  );
};

export default OpenProjectsTable;
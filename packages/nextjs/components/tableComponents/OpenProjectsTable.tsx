import React, { useEffect, useState } from "react";
import BaseTable from "../BaseTable";
import BidMenu from "../BidMenu";
import { fetchProjectFieldFromId, useFetchFields } from "../GetFieldsFromIds";
import { formatTableData } from "../utils";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const OpenProjectsTable: React.FC<any> = ({ data, storage, setTab }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  const { data: projectInfo } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined };

  const handleBidClick = () => {
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
      onClick: (project: any) => {
        setTab({ id: project.id, from: "worker" });
      },
      onClose: () => {
        true;
      },
      disabled: (row: any) => {
        return 0 * row;
      },
    },
    {
      id: "bid",
      name: "Bid",
      onClick: () => {
        handleBidClick();
      },
      onClose: () => {
        closeMenu;
      },
      disabled: (row: any) => {
        return 0 * row;
      },
    },
  ];

  const [isBidMenuOpen, setIsBidMenuOpen] = useState(false);

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
        ethAddress={projectInfo ? projectInfo[2] : "000000000000000000000"}
        projectSetter={setProject}
        searchTermPair={[searchTerm, setSearchTerm]}
        description={description}
      ></BaseTable>
      {isBidMenuOpen && <BidMenu onClose={closeMenu} project_id={project} storage={storage}></BidMenu>}
    </>
  );
};

export default OpenProjectsTable;

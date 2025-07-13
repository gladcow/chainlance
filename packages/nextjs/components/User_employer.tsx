import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { WriteCreateProject } from "./WriteCreateProject";
import EmployerProjectsTable from "./tableComponents/EmployerProjectsTable";
import { Bee } from "@ethersphere/bee-js";
import { useEffectOnce } from "usehooks-ts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserEmployerProps {
  address?: string;
  storage?: Bee;
  setTab: Dispatch<SetStateAction<string>>;
  stamp: string;
}

type TableKey = "Open" | "WorkInProgress" | "ToReview" | "Completed";

export const UserEmployer: React.FC<UserEmployerProps> = ({ address, storage, setTab, stamp }) => {
  const [selectTable, setSelectTable] = useState<TableKey>("Open");
  const [showCreate, setShowCreate] = useState(false);
  const [projectsToGetter, setProjectsToGetter] = useState({});

  const { data: ownerProjects } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listOwnerProjects",
    args: [address],
  }) as { data?: Array<{ id: string; [key: string]: any }> };

  const { data: statesGetter } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "getProjectStates",
    args: [projectsToGetter] as unknown as any,
    enabled: selectTable !== "Open" && !!ownerProjects,
  }) as { data?: number[] };

  useEffectOnce(() => {
    setSelectTable("Open");
  });

  useEffect(() => {
    setProjectsToGetter(ownerProjects ? ownerProjects : {});
  }, [ownerProjects]);

  const dataToSend = useMemo(() => {
    switch (selectTable) {
      case "Open":
        if (!ownerProjects || !statesGetter) return [];
        return ownerProjects.filter((_, idx) => statesGetter[idx] === 0);
      case "WorkInProgress":
        if (!ownerProjects || !statesGetter) return [];
        return ownerProjects.filter((_, idx) => statesGetter[idx] === 1);
      case "ToReview":
        if (!ownerProjects || !statesGetter) return [];
        return ownerProjects.filter((_, idx) => statesGetter[idx] === 2);
      case "Completed":
        if (!ownerProjects || !statesGetter) return [];
        return ownerProjects.filter((_, idx) => statesGetter[idx] === 3);
      default:
        return [];
    }
  }, [selectTable, ownerProjects, statesGetter]);

  const TableComponent = useMemo(() => {
    switch (selectTable) {
      case "Open":
      case "WorkInProgress":
      case "ToReview":
      case "Completed":
      default:
        return EmployerProjectsTable;
    }
  }, [selectTable]);

  if (
    (selectTable === "WorkInProgress" || selectTable === "ToReview" || selectTable === "Completed") &&
    (!ownerProjects || !statesGetter)
  ) {
    return (
      <div className="flex flex-row grow">
        <div className="w-full p-5 text-center">Loading projects…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row grow">
      <div className="w-full">
        <div className="flex items-center m-5">
          <select
            className="select select-bordered mr-5"
            value={selectTable}
            onChange={e => setSelectTable(e.target.value as TableKey)}
          >
            <option value="Open">Open projects</option>
            <option value="WorkInProgress">Work in progress</option>
            <option value="ToReview">Waiting Review</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="btn btn-ghost btn-circle" onClick={() => setShowCreate(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <TableComponent data={dataToSend} storage={storage} setTab={setTab} />
        {showCreate && <WriteCreateProject storage={storage} setCreateMenu={setShowCreate} stamp={stamp} />}
      </div>
    </div>
  );
};

export default UserEmployer;

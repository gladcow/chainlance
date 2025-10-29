import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import OpenProjectsTable from "./tableComponents/OpenProjectsTable";
import WorkerBidsTable from "./tableComponents/WorkerBidsTable";
import WorkerProjects from "./tableComponents/WorkerProjects";
import { Bee } from "@ethersphere/bee-js";
import { useContractRead } from "@/hooks/useContractRead";
import { ProjectsTableProps } from "./Utils";

interface UserWorkerProps {
  address?: string;
  storage?: Bee;
  storageAddress: string;
  setTab: Dispatch<SetStateAction<{ id: string; from?: string; state?: string; }>>
  storageStamp: string;
}
type TableKey = "Open" | "Bids" | "WorkInProgress" | "InReview" | "Completed";

export const UserWorker: React.FC<UserWorkerProps> = ({ address, storage, storageAddress, setTab, storageStamp }) => {
  const [selectTable, setSelectTable] = useState<TableKey>("Open");
  const [projectsToGetter, setProjectsToGetter] = useState({});

  const { data: projectlist } = useContractRead({
    functionName: "listProjectsWithState",
    args: [0],
    watch: true
  }) as { data?: Array<string> };

  const { data: workerBids } = useContractRead({
    functionName: "listWorkerBids",
    args: [address],
    watch: true
  }) as { data?: string[] };

  const { data: projectsWithWorker } = useContractRead({
    functionName: "listWorkerProjects",
    args: [address],
    watch: true
  }) as { data?: Array<string> };

  const { data: statesGetter } = useContractRead({
    functionName: "getProjectStates",
    args: [projectsToGetter] as unknown as bigint[],
    enabled:
      selectTable === "Completed" ||
      selectTable === "WorkInProgress" ||
      (selectTable === "InReview" && !!projectsWithWorker),
    watch: true
  }) as { data?: number[] };

  useEffect(() => {
    setSelectTable("Open");
  },[]);

  useEffect(() => {
    const plainProjects = projectsWithWorker ? [...projectsWithWorker] : [];
    setProjectsToGetter(plainProjects);
  }, [projectsWithWorker]);

  const dataToSend = useMemo(() => {
    switch (selectTable) {
      case "Open":
        return projectlist ?? [];
      case "Bids":
        return workerBids ?? [];
      case "WorkInProgress":
        if (!projectsWithWorker || !statesGetter || projectsWithWorker.length != statesGetter.length) return [];
        return projectsWithWorker.filter((_, idx) => Number(statesGetter[idx]) === 1);
      case "InReview":
        if (!projectsWithWorker || !statesGetter || projectsWithWorker.length != statesGetter.length) return [];
        return projectsWithWorker.filter((_, idx) => Number(statesGetter[idx]) === 2);
      case "Completed":
        if (!projectsWithWorker || !statesGetter || projectsWithWorker.length != statesGetter.length) return [];
        return projectsWithWorker.filter((_, idx) => Number(statesGetter[idx]) === 3);
    }
  }, [selectTable, projectlist, workerBids, projectsWithWorker, statesGetter]);

  type AnyComp = React.FC<ProjectsTableProps>;
  const TableComponent: AnyComp = useMemo(() => {
    switch (selectTable) {
      case "Bids":
        return WorkerBidsTable;
      case "WorkInProgress":
      case "InReview":
      case "Completed":
        return WorkerProjects;
      default:
        return OpenProjectsTable;
    }
  }, [selectTable]);

  if (
    (selectTable === "Completed" || selectTable === "WorkInProgress" || selectTable === "InReview") &&
    (!projectsWithWorker || !statesGetter)
  ) {
    return (
      <div className="flex flex-row grow">
        <div className="w-full p-5 text-center">Loading {selectTable.toLowerCase()} projects…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row grow">
      <div className="w-full">
        <select
          className="select select-bordered mr-5 ml-5 mt-5 mb-5 max-w-32"
          value={selectTable}
          onChange={e => setSelectTable(e.target.value as SetStateAction<TableKey>)}
        >
          <option value="Open">Open Projects</option>
          <option value="Bids">My Bids</option>
          <option value="WorkInProgress">Work In Progress</option>
          <option value="InReview">In Review</option>
          <option value="Completed">Completed</option>
        </select>

        <TableComponent data={dataToSend} storage={storage} storageAddress={storageAddress} setTab={setTab} activeTable={selectTable} storageStamp={storageStamp}/>
      </div>
    </div>
  );
};

export default UserWorker;
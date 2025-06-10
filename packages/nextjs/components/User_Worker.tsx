import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import OpenProjectsTable from "./tableComponents/OpenProjectsTable";
import WorkerBidsTable from "./tableComponents/WorkerBidsTable";
import WorkerProjects from "./tableComponents/WorkerProjects";
import { Bee } from "@ethersphere/bee-js";
import { useEffectOnce } from "usehooks-ts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserWorkerProps {
  address?: string;
  storage?: Bee;
  setTab: Dispatch<SetStateAction<string>>;
}
type TableKey = "Open" | "Bids" | "WorkInProgress" | "InReview" | "Completed";

export const UserWorker: React.FC<UserWorkerProps> = ({ address, storage, setTab }) => {
  const [selectTable, setSelectTable] = useState<TableKey>("Open");
  const [projectsToGetter, setProjectsToGetter] = useState({});

  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  }) as { data?: Array<{ id: string; [key: string]: any }> };

  const { data: workerBids } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listWorkerBids",
    args: [address],
  }) as { data?: any[] };

  const { data: projectsWithWorker } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listWorkerProjects",
    args: [address],
  }) as { data?: Array<{ id: string; [key: string]: any }> };

  const { data: statesGetter } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "getProjectStates",
    args: [projectsToGetter] as unknown as any,
    enabled:
      selectTable === "Completed" ||
      selectTable === "WorkInProgress" ||
      (selectTable === "InReview" && !!projectsWithWorker),
  }) as { data?: number[] };

  useEffectOnce(() => {
    setSelectTable("Open");
  });

  useEffect(() => {
    setProjectsToGetter(projectsWithWorker ? projectsWithWorker : {});
  }, [projectsWithWorker]);

  const dataToSend = useMemo(() => {
    switch (selectTable) {
      case "Open":
        return projectlist ?? [];
      case "Bids":
        return workerBids ?? [];
      case "WorkInProgress":
        if (!projectsWithWorker || !statesGetter) return [];
        return projectsWithWorker.filter((_, idx) => statesGetter[idx] === 1);
      case "InReview":
        if (!projectsWithWorker || !statesGetter) return [];
        return projectsWithWorker.filter((_, idx) => statesGetter[idx] === 2);
      case "Completed":
        if (!projectsWithWorker || !statesGetter) return [];
        return projectsWithWorker.filter((_, idx) => statesGetter[idx] === 3);
    }
  }, [selectTable, projectlist, workerBids, projectsWithWorker, statesGetter]);

  type AnyComp = React.FC<any>;
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
          onChange={e => setSelectTable(e.target.value as any)}
        >
          <option value="Open">Open Projects</option>
          <option value="Bids">My Bids</option>
          <option value="WorkInProgress">Work In Progress</option>
          <option value="InReview">In Review</option>
          <option value="Completed">Completed</option>
        </select>

        <TableComponent data={dataToSend} storage={storage} setTab={setTab} />
      </div>
    </div>
  );
};

export default UserWorker;

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import OpenProjectsTable from "./tableComponents/OpenProjectsTable";
import WorkerBidsTable from "./tableComponents/WorkerBidsTable";
import ProjectsWithAcceptedBids from "./tableComponents/WorkerProjects";
import { Bee } from "@ethersphere/bee-js";
import { useEffectOnce } from "usehooks-ts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserWorkerProps {
  address: string | undefined;
  columns: any;
  storage: Bee | undefined;
  setTab: Dispatch<SetStateAction<string>>;
}

export const UserWorker = ({ address, storage, setTab }: UserWorkerProps) => {
  const [selectTable, setSelectTable] = useState("Open projects");
  const [dataToSendToTable, setDataToSendToTable] = useState<any[] | undefined>();
  const [tableComponent, setTableComponent] = useState<React.JSX.Element>(
    <OpenProjectsTable data={dataToSendToTable} storage={storage}></OpenProjectsTable>,
  );
  // const [stateToCheck, setStateToCheck] = useState<string[] | undefined>([''])
  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  }) as { data: any[] | undefined };

  const { data: workerBids } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listWorkerBids",
    args: [address],
  }) as { data: any[] | undefined };

  const { data: projectsWithWorker } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listWorkerProjects",
    args: [address],
  }) as { data: any[] | undefined };

  // const { data: statesGetter } = useScaffoldContractRead({
  //   contractName: "ChainLance",
  //   functionName: "getProjectStates",
  //   args: [stateToCheck] as unknown as any

  // })

  useEffectOnce(() => {
    setDataToSendToTable(projectlist);
  });
  // useEffect(()=>{
  //   setStateToCheck(projectsWithWorker)
  //   console.log(statesGetter)
  // },[projectsWithWorker])
  useEffect(() => {
    switch (selectTable) {
      case "Open projects":
        setDataToSendToTable(projectlist);
        setTableComponent(
          <OpenProjectsTable data={dataToSendToTable} storage={storage} setTab={setTab}></OpenProjectsTable>,
        );
        break;
      case "Worker bids":
        setDataToSendToTable(workerBids);
        setTableComponent(
          <WorkerBidsTable data={dataToSendToTable} storage={storage} setTab={setTab}></WorkerBidsTable>,
        );
        break;
      case "Worker projects":
        setDataToSendToTable(projectsWithWorker);
        setTableComponent(
          <ProjectsWithAcceptedBids
            data={dataToSendToTable}
            storage={storage}
            setTab={setTab}
          ></ProjectsWithAcceptedBids>,
        );
        break;
    }
  }, [projectsWithWorker, selectTable, workerBids, projectlist, dataToSendToTable, storage, setTab]);

  return (
    <div className="flex flex-row grow">
      <div className="w-full">
        <select
          className="select select-bordered mr-5 ml-5 mt-5 mb-5 max-w-20"
          defaultValue={"Open projects"}
          value={selectTable}
          onChange={e => setSelectTable(e.target.value)}
        >
          <option disabled selected>
            Choose table
          </option>
          <option value={"Open projects"}>Open projects</option>
          <option value={"Worker bids"}>My bids</option>
          <option value={"Worker projects"}>Accepted projects</option>
        </select>
        {tableComponent}
      </div>
    </div>
  );
};

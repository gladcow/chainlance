import React, { useEffect, useState } from "react";
import OpenProjectsTable from "./OpenProjectsTable";
import WorkerBidsTable from "./WorkerBidsTable";
import ProjectsWithAcceptedBids from "./WorkerProjects";
import { WriteSubmitWork } from "./WriteSubmitWork";
import { Bee } from "@ethersphere/bee-js";
import { useEffectOnce } from "usehooks-ts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserWorkerProps {
  address: string | undefined;
  columns: any;
  storage: Bee | undefined;
}

export const UserWorker = ({ address, storage }: UserWorkerProps) => {
  const [selectTable, setSelectTable] = useState("Open projects");
  const [dataToSendToTable, setDataToSendToTable] = useState<any[] | undefined>();
  const [tableComponent, setTableComponent] = useState<React.JSX.Element>(
    <OpenProjectsTable data={dataToSendToTable} storage={storage}></OpenProjectsTable>,
  );
  //   function findCommonElements(arr1: any[] | undefined, arr2: any[] | undefined): any[] {
  //     const set1 = new Set(arr1);
  //     const commonElements = [];
  //     if (arr1 == undefined || arr2 == undefined){
  //       return ['']
  //     }
  //       for (let num of arr2) {
  //           if (set1.has(num)) {
  //               commonElements.push(num);
  //               set1.delete(num);
  //           }
  //       }

  //     return commonElements;
  // }
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
  useEffectOnce(() => {
    setDataToSendToTable(projectlist);
  });

  const { data: projectsWithWorker } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listWorkerProjects",
    args: [address],
  }) as { data: any[] | undefined };

  useEffect(() => {
    switch (selectTable) {
      case "Open projects":
        setDataToSendToTable(projectlist);
        setTableComponent(<OpenProjectsTable data={dataToSendToTable} storage={storage}></OpenProjectsTable>);
        break;
      case "Worker bids":
        setDataToSendToTable(workerBids);
        console.log(dataToSendToTable);
        setTableComponent(<WorkerBidsTable data={dataToSendToTable} storage={storage}></WorkerBidsTable>);
        break;
      case "Worker projects":
        setDataToSendToTable(projectsWithWorker);
        setTableComponent(
          <ProjectsWithAcceptedBids data={dataToSendToTable} storage={storage}></ProjectsWithAcceptedBids>,
        );
        break;
    }
  }, [projectsWithWorker, selectTable, workerBids, projectlist, dataToSendToTable, storage]);

  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <div className="self-start card w-5/6 bg-base-100 shadow-xl m-5">
          <div className="card-body">
            <h2 className="card-title">Hello</h2>
            <p>For a worker</p>
          </div>
        </div>

        <WriteSubmitWork></WriteSubmitWork>
      </div>

      <div className="w-full">
        <select
          className="select select-bordered mr-5 ml-5 mt-5 max-w-20"
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

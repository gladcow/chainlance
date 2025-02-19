import { useEffect, useState } from "react";
import EmployerProjectsTable from "./EmployerProjectsTable";
import { WriteCreateProject } from "./WriteCreateProject";
import { Bee } from "@ethersphere/bee-js";
import { useEffectOnce } from "usehooks-ts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserEmployerProps {
  address: string | undefined;
  columns: string[];
  storage: Bee | undefined;
}

export const UserEmployer = ({ address, storage }: UserEmployerProps) => {
  const [selectTable, setSelectTable] = useState("My projects");
  const [dataToSendToTable, setDataToSendToTable] = useState<any[] | undefined>();
  const [tableComponent, setTableComponent] = useState<React.JSX.Element>(
    <EmployerProjectsTable data={dataToSendToTable} storage={storage}></EmployerProjectsTable>,
  );

  const { data: ownerProjects } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listOwnerProjects",
    args: [address],
  }) as { data: any[] | undefined };

  useEffectOnce(() => {
    setDataToSendToTable(ownerProjects);
  });

  useEffect(() => {
    switch (selectTable) {
      case "My projects":
        console.log(ownerProjects);
        setDataToSendToTable(ownerProjects);
        setTableComponent(<EmployerProjectsTable data={dataToSendToTable} storage={storage}></EmployerProjectsTable>);
        break;
    }
  }, [ownerProjects, selectTable, dataToSendToTable, storage]);

  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject storage={storage}></WriteCreateProject>
      </div>

      <div className="w-full">
        <select
          className="select select-bordered mr-5 ml-5 mt-5 max-w-20"
          defaultValue={"My projects"}
          value={selectTable}
          onChange={e => setSelectTable(e.target.value)}
        >
          <option disabled selected>
            Choose table
          </option>
          <option value={"My projects"}>My projects</option>
          <option value={"his projects"}>his projects</option>
        </select>
        {tableComponent}
      </div>
    </div>
  );
};

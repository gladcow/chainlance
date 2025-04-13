import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WriteCreateProject } from "./WriteCreateProject";
import EmployerProjectsTable from "./tableComponents/EmployerProjectsTable";
import { Bee } from "@ethersphere/bee-js";
import { useEffectOnce } from "usehooks-ts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserEmployerProps {
  address: string | undefined;
  columns: string[];
  storage: Bee | undefined;
  setTab: Dispatch<SetStateAction<string>>;
}

export const UserEmployer = ({ address, storage, setTab }: UserEmployerProps) => {
  const [selectTable, setSelectTable] = useState("My projects");
  const [dataToSendToTable, setDataToSendToTable] = useState<any[] | undefined>();
  const [tableComponent, setTableComponent] = useState<React.JSX.Element>(
    <EmployerProjectsTable data={dataToSendToTable} storage={storage}></EmployerProjectsTable>,
  );
  const [createMenu, setCreateMenu] = useState(false);

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
        setDataToSendToTable(ownerProjects);
        setTableComponent(
          <EmployerProjectsTable data={dataToSendToTable} storage={storage} setTab={setTab}></EmployerProjectsTable>,
        );
        break;
    }
  }, [ownerProjects, selectTable, dataToSendToTable, storage, setTab]);

  return (
    <div className="flex flex-row grow">
      <div className="w-full">
        <div className="flex flex-row">
          <select
            className="select select-bordered m-5 max-w-20"
            defaultValue={"My projects"}
            value={selectTable}
            onChange={e => setSelectTable(e.target.value)}
          >
            <option disabled selected>
              Choose table
            </option>
            <option value={"My projects"}>My projects</option>
          </select>
          <label
            onClick={() => {
              setCreateMenu(true);
            }}
            className="btn btn-ghost btn-circle self-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </label>
        </div>
        {tableComponent}
        {createMenu ? <WriteCreateProject storage={storage} setCreateMenu={setCreateMenu}></WriteCreateProject> : <></>}
      </div>
    </div>
  );
};

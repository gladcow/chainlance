import { useState } from "react";
import { WriteCreateProject } from "./WriteCreateProject";
import TableWithSearchAndSort from "./table_daisy";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserEmployerProps {
  address: string | undefined;
  columns: string[];
  storage: Bee | undefined;
}

export const UserEmployer = ({ address, columns, storage }: UserEmployerProps) => {
  const [selectTable, setSelectTable] = useState("Open projects");

  const { data: ownerProjects } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listOwnerProjects",
    args: [address],
  }) as { data: any[] | undefined };
  // const { data: projectBids } = useScaffoldContractRead({
  //   contractName: "ChainLance",
  //   functionName: "listOwnerProjects",
  //   args: [address],
  // }) as { data: any[] | undefined };

  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject storage={storage}></WriteCreateProject>
      </div>

      <div className="w-full">
        <select
          className="select select-bordered mr-5 ml-5 mt-5 max-w-20"
          value={selectTable}
          onChange={e => setSelectTable(e.target.value)}
        >
          <option disabled selected>
            Choose table
          </option>
          <option value={"My projects"}>My projects</option>
        </select>
        <TableWithSearchAndSort initialData={ownerProjects} columns={columns} storage={storage} buttons={[]} />
      </div>
    </div>
  );
};

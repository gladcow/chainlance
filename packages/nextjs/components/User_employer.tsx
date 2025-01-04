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
  const { data: owner_projects } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listOwnerProjects",
    args: [address],
  }) as { data: any[] | undefined };
  const all_owner_projects = owner_projects
    ? owner_projects.map(projectId => ({
        id: projectId,
      }))
    : [];
  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject storage={storage}></WriteCreateProject>
      </div>

      <div className="w-full">
        <TableWithSearchAndSort initialData={all_owner_projects} columns={columns} storage={storage} buttons={[]} />
      </div>
    </div>
  );
};

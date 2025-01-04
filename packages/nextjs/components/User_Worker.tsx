import { WriteSubmitWork } from "./WriteSubmitWork";
import TableWithSearchAndSort from "./table_daisy";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserWorkerProps {
  columns: any;
  storage: Bee | undefined;
}

export const UserWorker = ({ columns, storage }: UserWorkerProps) => {
  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  }) as { data: any[] | undefined };
  const all_open_projects = projectlist
    ? projectlist.map(projectId => ({
        id: projectId,
      }))
    : [];
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
        <TableWithSearchAndSort initialData={all_open_projects} columns={columns} storage={storage} buttons={["bid"]} />
      </div>
    </div>
  );
};

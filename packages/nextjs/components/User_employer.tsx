import { WriteCreateProject } from "./WriteCreateProject";
import TableWithSearchAndSort from "./table_daisy";
import { KuboRPCClient } from "kubo-rpc-client";

interface UserEmployerProps {
  data: any;
  columns: any;
  ipfsNode: KuboRPCClient | undefined;
}

export const UserEmployer = ({ data, columns, ipfsNode }: UserEmployerProps) => {
  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject ipfsNode={ipfsNode}></WriteCreateProject>
      </div>

      <div className="justify-end grow">
        <TableWithSearchAndSort data={data} columns={columns} ipfsNode={ipfsNode} />
      </div>
    </div>
  );
};

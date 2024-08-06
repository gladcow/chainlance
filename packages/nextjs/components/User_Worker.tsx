import { WriteSubmitWork } from "./WriteSubmitWork";
import TableWithSearchAndSort from "./table_daisy";
import { KuboRPCClient } from "kubo-rpc-client";

interface UserWorkerProps {
  data: any;
  columns: any;
  ipfsNode: KuboRPCClient | undefined;
}

export const UserWorker = ({ data, columns, ipfsNode }: UserWorkerProps) => {
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

      <div className="justify-end grow">
        <TableWithSearchAndSort initialData={data} columns={columns} ipfsNode={ipfsNode} />
      </div>
      <div className="justify-end grow">
        <TableWithSearchAndSort initialData={data} columns={columns} ipfsNode={ipfsNode} />
      </div>
    </div>
  );
};

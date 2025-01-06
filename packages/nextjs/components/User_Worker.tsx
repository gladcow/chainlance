import { useEffect, useState } from "react";
import { WriteSubmitWork } from "./WriteSubmitWork";
import TableWithSearchAndSort from "./table_daisy";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface UserWorkerProps {
  address: string | undefined;
  columns: any;
  storage: Bee | undefined;
}

export const UserWorker = ({ address, storage }: UserWorkerProps) => {
  const [selectTable, setSelectTable] = useState("Open projects");
  const [dataToSendToTable, setDataToSendToTable] = useState<any[] | undefined>();
  const [columns, setColumns] = useState<any[""]>(["title", "timeSpan", "price"]);
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

  useEffect(() => {
    switch (selectTable) {
      case "Open projects":
        setDataToSendToTable(projectlist);
        setColumns(["title", "timeSpan", "price"]);
        break;
      case "Worker bids":
        setDataToSendToTable(workerBids);
        setColumns(["project_id", "timeSpan", "price"]);
        break;
    }
  }, [selectTable, workerBids, projectlist]);

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
        </select>
        <TableWithSearchAndSort initialData={dataToSendToTable} columns={columns} storage={storage} buttons={["bid"]} />
      </div>
    </div>
  );
};

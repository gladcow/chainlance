import { useState } from "react";
import { WriteCreateProject } from "./WriteCreateProject";
import TableWithSearchAndSort from "./table_daisy";
import { KuboRPCClient } from "kubo-rpc-client";

interface UserEmployerProps {
  data: any[];
  columns: string[];
  ipfsNode: KuboRPCClient | undefined;
}

export const UserEmployer = ({ data, columns, ipfsNode }: UserEmployerProps) => {
  const [projects, setProjects] = useState(data);

  const handleProjectCreated = (newProject: any) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject ipfsNode={ipfsNode} onProjectCreated={handleProjectCreated}></WriteCreateProject>
      </div>

      <div className="justify-end grow">
        <TableWithSearchAndSort initialData={projects} columns={columns} ipfsNode={ipfsNode} />
      </div>
    </div>
  );
};

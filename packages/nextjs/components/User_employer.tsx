import { WriteCreateProject } from "./WriteCreateProject";
import TableWithSearchAndSort from "./table_daisy";
import { Bee } from "@ethersphere/bee-js";

interface UserEmployerProps {
  data: any[];
  columns: string[];
  storage: Bee | undefined;
}

export const UserEmployer = ({ data, columns, storage }: UserEmployerProps) => {
  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject storage={storage}></WriteCreateProject>
      </div>

      <div className="justify-end grow">
        <TableWithSearchAndSort initialData={data} columns={columns} storage={storage} />
      </div>
    </div>
  );
};

import { WriteCreateProject } from "./WriteCreateProject";
import TableWithSearchAndSort from "./table_daisy";

interface UserEmployerProps {
  data: any;
  columns: any;
  helia: any;
  heliaOnline: boolean;
}

export const UserEmployer = ({ data, columns, helia, heliaOnline }: UserEmployerProps) => {
  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col w-1/2">
        <WriteCreateProject helia={helia} heliaOnline={heliaOnline}></WriteCreateProject>
      </div>

      <div className="justify-end grow">
        <TableWithSearchAndSort data={data} columns={columns} helia={helia} heliaOnline={heliaOnline} />
      </div>
    </div>
  );
};

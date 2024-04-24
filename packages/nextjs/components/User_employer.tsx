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
        <div className="self-start card w-5/6 bg-base-100 shadow-xl m-5">
          <div className="card-body">
            <h2 className="card-title">Hello</h2>
            <p>For a employer</p>
          </div>
        </div>
          <WriteCreateProject helia={helia} heliaOnline={heliaOnline}></WriteCreateProject>
      </div>

      <div className="justify-end grow">
        <TableWithSearchAndSort data={data} columns={columns} />
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { fetchProjectFieldFromId } from "./GetFieldsFromIds";
import ProjectBidsTable from "./ProjectBidsTable";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface ProjectPageProps {
  project: any;
  storage: Bee | undefined;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ project, storage }) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [timespan, setTimespan] = useState("");
  const [price, setPrice] = useState("");

  const { data: projectBids } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectBids",
    args: [project.id],
  }) as { data: any[] | undefined };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const description = await fetchProjectFieldFromId(storage, project.id, "description");
        const title = await fetchProjectFieldFromId(storage, project.id, "title");
        const timespan = await fetchProjectFieldFromId(storage, project.id, "timeSpan");
        const price = await fetchProjectFieldFromId(storage, project.id, "price");
        setTimespan(timespan);
        setPrice(price);
        setTitle(title);
        setDescription(description);
      } catch (error) {
        console.error("Failed to fetch description:", error);
      }
    };
    if (project.id) {
      fetchData();
    }
  }, [project, storage]);

  return (
    <div className="flex flex-col w-full">
      <div className="card w-full">
        <div className="card-body">
          <div className="flex flex-row bg-primary p-5 justify-between w-full">
            <div className="flex self-center">
              <p className="text-[32px]">Project name: {title}</p>
            </div>
            <div className="flex flex-col bg-base-100 p-2 w-1/5 items-left">
              <p className="text-[28px]">time: {timespan} days</p>
              <p className="text-[28px]">price: {price}</p>
            </div>
          </div>
          <p className="bg-primary p-5 text-lg">{description}</p>
        </div>
      </div>

      <div className="w-full">
        {project.from != "employer" || project.state
          ? project.state == 0
          : true && <ProjectBidsTable data={projectBids} storage={storage}></ProjectBidsTable>}
      </div>
    </div>
  );
};
export default ProjectPage;

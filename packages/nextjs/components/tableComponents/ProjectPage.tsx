import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ClockIcon, CurrencyDollarIcon } from "../BaseTableParts";
import { fetchProjectFieldFromId } from "../GetFieldsFromIds";
import { timeRetrive } from "../utils";
import ProjectBidsTable from "./ProjectBidsTable";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface ProjectPageProps {
  project: any;
  storage: Bee | undefined;
  setTab: Dispatch<SetStateAction<string>>;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ project, storage, setTab }) => {
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn min-w-[600px]">
      <div className="bg-primary rounded-2xl shadow-xl overflow-hidden border border-primary/20">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 relative">
          {/* Back Button */}
          <button
            onClick={() => setTab(project.from)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm shadow-sm z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-r from-white/20 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 relative">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">{title}</h1>
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 min-w-[240px] transition-transform hover:scale-[1.02]">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-6 h-6 text-green-200" />
                  <span className="text-green-50 font-medium text-lg">{timeRetrive(Number(timespan))}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-200" />
                  <span className="text-green-50 font-medium text-lg">{price}xDai</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="p-8 bg-primary border-b border-primary/30">
          <h2 className="text-xl font-semibold mb-4 text-primary-content">Project Description</h2>
          <p className="leading-relaxed whitespace-pre-line text-primary-content/90">{description}</p>
        </div>

        {/* Bids Section */}
        {project.from == "employer" && project.state == 0 && (
          <div className="p-8 bg-secondary">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <h2 className="text-primary-content">Project Bids</h2>
            </h2>
            <ProjectBidsTable data={projectBids} storage={storage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;

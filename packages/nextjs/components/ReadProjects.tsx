import { useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const ReadProjects = () => {
  const [showProjects, setShowProjects] = useState(false);

  const { data: reciept } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  });
  return (
    <div className="self-start card w-96 bg-base-100 shadow-xl m-5">
      <div className="card-body items-center">
        <h2 className="card-title">Read Projects</h2>
        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={() => setShowProjects(true)}>
            Show Open Projects
          </button>

          {showProjects ? (
            <div className="transition ease-in-out delay-50 card w-30 bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Open projects</h2>
                <p className="break-all"> {reciept ? reciept.toString() : <></>}</p>
              </div>
            </div>
          ) : (
            <div className="transition ease-in-out delay-50"></div>
          )}
        </div>
      </div>
    </div>
  );
};

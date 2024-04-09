import { useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const ReadProjects = () => {
  const [projectId, setProjectId] = useState(0);
  const [showProjects, setShowProjects] = useState(false);

  const { data: reciept } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [BigInt(projectId)],
    watch: true,
  });
  return (
    <div className="self-start card w-96 bg-base-100 shadow-xl m-5">
      <div className="card-body items-center">
        <h2 className="card-title">Read Projects</h2>
        <div className="card-actions justify-center">
          <input
            type="text"
            placeholder="Write your greeting"
            className="input border border-primary"
            onChange={e => {
              setProjectId(Number(e.target.value));
              setShowProjects(false);
            }}
          />
          <button className="btn btn-primary" onClick={() => setShowProjects(true)}>
            Find
          </button>

          {showProjects ? (
            <div className="transition ease-in-out delay-50 card w-30 bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Card title!</h2>
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

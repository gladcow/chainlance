import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const WriteSubmitWork = () => {
  const [projectId, setProjectId] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [reciept, setReciept] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "submitWork",
    args: [BigInt(projectId)],
    onBlockConfirmation: txnReceipt => {
      setReciept(txnReceipt.blockHash.toString());
    },
  });
  return (
    <div className="self-start card w-96 bg-base-100 shadow-xl m-5">
      <div className="card-body items-center">
        <h2 className="card-title">Submit Work</h2>
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
          <button
            className="btn btn-primary"
            onClick={() => {
              writeAsync();
              reciept ? setShowProjects(true) : console.log(reciept);
            }}
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Send</>}
          </button>

          {showProjects ? (
            <div className="transition ease-in-out delay-50 card w-30 bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Card title!</h2>
                <p className="break-all"> {reciept ? reciept : <></>}</p>
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

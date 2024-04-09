import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const WriteCreateProject = () => {
  const [externalDiscription, setExternalDiscription] = useState(0);
  const [price, setPrice] = useState(0);
  const [timeSpan, setTimeSpan] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [reciept, setReciept] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "createProject",
    args: [BigInt(externalDiscription), BigInt(price), timeSpan],
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
            placeholder="projectId"
            className="input border border-primary"
            onChange={e => {
              setExternalDiscription(Number(e.target.value));
              setShowProjects(false);
            }}
          />
          <input
            type="text"
            placeholder="price"
            className="input border border-primary"
            onChange={e => {
              setPrice(Number(e.target.value));
              setShowProjects(false);
            }}
          />
          <input
            type="text"
            placeholder="timeSpan"
            className="input border border-primary"
            onChange={e => {
              setTimeSpan(Number(e.target.value));
              setShowProjects(false);
            }}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              writeAsync();
              setShowProjects(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Send</>}
          </button>

          {!reciept || !showProjects ? (
            <></>
          ) : (
            <div className="transition ease-in-out delay-50 card w-30 bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Card title!</h2>
                <p className="break-all"> {reciept ? reciept : <></>}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

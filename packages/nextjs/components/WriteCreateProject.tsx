import { useEffect, useState } from "react";
import { json } from "@helia/json";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface WriteCreateProjectProps {
  helia: any;
  heliaOnline: boolean;
}

export const WriteCreateProject = ({ helia, heliaOnline }: WriteCreateProjectProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalDiscription, setExternalDiscription] = useState("");
  const [price, setPrice] = useState(0);
  const [timeSpan, setTimeSpan] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [reciept, setReciept] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "createProject",
    args: [externalDiscription, BigInt(price), timeSpan],
    onBlockConfirmation: txnReceipt => {
      setReciept(txnReceipt.blockHash.toString());
    },
  });

  useEffect(() => {
    writeAsync();
  }, [externalDiscription]);
  const writeProjectDetailsToIPFS = async function () {
    const j = json(helia);
    const cid = await j.add({ title: title, description: description, price: price, timeSpan: timeSpan });
    setExternalDiscription(cid.toString());
  };
  return (
    <div className="self-start card w-96 bg-base-100 shadow-xl m-5">
      <div className="card-body items-center">
        <h2 className="card-title">Create Project</h2>
        <div className="card-actions justify-center">
          <input
            type="text"
            placeholder="Title"
            className="input border border-primary"
            onChange={e => {
              setTitle(e.target.value);
              setShowProjects(false);
            }}
          />
          <input
            type="text"
            placeholder="Description"
            className="input border border-primary"
            onChange={e => {
              setDescription(e.target.value);
              setShowProjects(false);
            }}
          />
          <input
            type="text"
            placeholder="Price"
            className="input border border-primary"
            onChange={e => {
              setPrice(Number(e.target.value));
              setShowProjects(false);
            }}
          />
          <input
            type="text"
            placeholder="Time"
            className="input border border-primary"
            onChange={e => {
              setTimeSpan(Number(e.target.value));
              setShowProjects(false);
            }}
          />
          {heliaOnline && (
            <button
              className="btn btn-primary"
              onClick={() => {
                writeProjectDetailsToIPFS();
                setShowProjects(false);
              }}
            >
              {isLoading ? <span className="loading loading-spinner loading-sm m-5"></span> : <>Create Project</>}
            </button>
          )}
          {/* <input
            type="text"
            placeholder="projectId"
            className="input border border-primary"
            onChange={e => {
              setExternalDiscription(e.target.value);
              setShowProjects(false);
            }}
            value={externalDiscription}
          /> */}
          {/* <button
            className="btn btn-primary"
            onClick={() => {
              writeAsync();
              setShowProjects(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Create Project</>}
          </button> */}

          {!reciept || !showProjects ? (
            <></>
          ) : (
            <div className="transition ease-in-out delay-50 card w-30 bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Project Created!</h2>
                <p className="break-all"> {reciept ? reciept : <></>}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

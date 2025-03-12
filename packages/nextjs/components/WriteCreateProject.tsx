import { Dispatch, SetStateAction, useState } from "react";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface WriteCreateProjectProps {
  storage: Bee | undefined;
  setCreateMenu: Dispatch<SetStateAction<boolean>>;
}

export const WriteCreateProject = ({ storage, setCreateMenu }: WriteCreateProjectProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalDescription, setExternalDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [timeSpan, setTimeSpan] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "createProject",
    args: [externalDescription, BigInt(price), timeSpan],
    onBlockConfirmation: txnReceipt => {
      setReceipt(txnReceipt.blockHash.toString());
    },
  });

  const writeProjectDetailsToStorage = async function () {
    const res = await storage?.uploadData(
      "f1e4ff753ea1cb923269ed0cda909d13a10d624719edf261e196584e9e764e50",
      JSON.stringify({ title: title, description: description, price: price, timeSpan: timeSpan }),
    );
    const id = res?.reference.toString();
    setExternalDescription(id === undefined ? "" : id);
    writeAsync({ args: [id, BigInt(price), timeSpan] });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrice(Number(value));
      setPriceError("");
    } else {
      setPriceError("Price must be an integer.");
    }
    setShowProjects(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTimeSpan(Number(value));
      setTimeError("");
    } else {
      setTimeError("Time must be an integer.");
    }
    setShowProjects(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Create Project</h2>
            <button
              className="btn btn-square"
              onClick={() => {
                setCreateMenu(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="card-actions justify-end">
            <input
              type="text"
              placeholder="Title"
              className="input w-full border border-primary"
              onChange={e => {
                setTitle(e.target.value);
                setShowProjects(false);
              }}
            />
            <textarea
              placeholder="Description"
              className="textarea w-full textarea-primary text-base"
              onChange={e => {
                setDescription(e.target.value);
                setShowProjects(false);
              }}
            />
            <input
              type="text"
              placeholder="Price"
              className="input w-full border border-primary"
              onChange={handlePriceChange}
            />
            {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
            <input
              type="text"
              placeholder="Time"
              className="input w-full border border-primary"
              onChange={handleTimeChange}
            />
            {timeError && <p className="relative text-red-500 text-sm">{timeError}</p>}
            {true && (
              <button
                className="btn btn-primary"
                onClick={writeProjectDetailsToStorage}
                disabled={!!priceError || !!timeError}
              >
                {isLoading ? <span className="loading loading-spinner loading-sm m-5"></span> : <>Create Project</>}
              </button>
            )}
            {!receipt || !showProjects ? (
              <></>
            ) : (
              <div className="transition ease-in-out delay-50 card w-30 bg-primary text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">Project Created!</h2>
                  <p className="break-all"> {receipt ? receipt : <></>}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

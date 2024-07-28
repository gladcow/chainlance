import { useEffect, useState } from "react";
import { checkIpfsOnline } from "./utils";
import { KuboRPCClient } from "kubo-rpc-client";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface WriteCreateProjectProps {
  ipfsNode: KuboRPCClient | undefined;
}

export const WriteCreateProject = ({ ipfsNode }: WriteCreateProjectProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalDescription, setExternalDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [timeSpan, setTimeSpan] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [ipfsOnline, setIpfsOnline] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    const init = async () => {
      const online = await checkIpfsOnline(ipfsNode);
      setIpfsOnline(online);
    };
    init();
  }, [ipfsNode]);

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "createProject",
    args: [externalDescription, BigInt(price), timeSpan],
    onBlockConfirmation: txnReceipt => {
      setReceipt(txnReceipt.blockHash.toString());
    },
  });

  const writeProjectDetailsToIPFS = async function () {
    const res = await ipfsNode?.add(
      JSON.stringify({ title: title, description: description, price: price, timeSpan: timeSpan }),
    );
    const id = res?.cid.toString();
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
          <input type="text" placeholder="Price" className="input border border-primary" onChange={handlePriceChange} />
          {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
          <input type="text" placeholder="Time" className="input border border-primary" onChange={handleTimeChange} />
          {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
          {ipfsOnline && (
            <button
              className="btn btn-primary"
              onClick={writeProjectDetailsToIPFS}
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
  );
};

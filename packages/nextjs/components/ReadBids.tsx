import { useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const ReadBids = () => {
  const [workId, setWorkId] = useState("");
  const [showBids, setShowBids] = useState(false);

  const { data: reciept } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "bids",
    args: [workId],
    watch: true,
  });
  return (
    <div className="self-start card w-96 bg-base-100 shadow-xl m-5">
      <div className="card-body items-center">
        <h2 className="card-title">Read Bids</h2>
        <div className="card-actions justify-center">
          <input
            type="text"
            placeholder="Work id"
            className="input border border-primary"
            onChange={e => {
              setWorkId(e.target.value);
              setShowBids(false);
            }}
          />
          <button className="btn btn-primary" onClick={() => setShowBids(true)}>
            Find
          </button>

          {showBids ? (
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

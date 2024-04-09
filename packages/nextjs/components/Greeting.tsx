import { useState } from "react";
import { parseEther } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ChainLance = () => {
  const [newProjectId, setNewProjectId] = useState(0);
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "submitWork",
    args: [BigInt(newProjectId)],
    value: parseEther("0.1"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <input
        type="text"
        placeholder="Write your greeting"
        className="input border border-primary"
        onChange={e => setNewProjectId(parseInt(e.target.value))}
      />
      <button className="btn btn-primary" onClick={() => writeAsync()} disabled={isLoading}>
        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Send</>}
      </button>
    </>
  );
};

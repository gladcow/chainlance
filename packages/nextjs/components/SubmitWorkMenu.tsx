import React from "react";
import { submitWork } from "./SubmitWork";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";

interface BidMenuProps {
  onClose: () => void;
  project_id: string;
}

const SubmitWorkMenu: React.FC<BidMenuProps> = ({ onClose, project_id }) => {
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "submitWork",
    args: [] as unknown as [string],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWork(project_id, writeAsync);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Work submition</h2>
            <button className="btn btn-square" onClick={onClose}>
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
          <p>Press this button if you submited work</p>
          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Submit work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitWorkMenu;

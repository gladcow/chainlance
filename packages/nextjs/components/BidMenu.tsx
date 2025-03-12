import React from "react";
import { useState } from "react";
import { placeBid } from "./placeBid";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";

interface BidMenuProps {
  onClose: () => void;
  project_id: string;
  storage: Bee | undefined;
}

const BidMenu: React.FC<BidMenuProps> = ({ onClose, project_id, storage }) => {
  const [projectDescription, setProjectDescription] = useState("");
  const [timeSpan, setTimeSpan] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "bidProject",
    args: [] as unknown as [string, string, bigint, number],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeBid(project_id, projectDescription, timeSpan, BigInt(price), writeAsync, storage);
    onClose();
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrice(Number(value));
      setPriceError("");
    } else {
      setPriceError("Price must be an integer.");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTimeSpan(Number(value));
      setTimeError("");
    } else {
      setTimeError("Time must be an integer.");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Place your bid</h2>
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
          <p>You can write a message to this employer</p>
          <div className="card-actions justify-end">
            <textarea
              placeholder="Description"
              className="textarea textarea-primary text-base"
              onChange={e => {
                setProjectDescription(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Price"
              className="input border border-primary"
              onChange={handlePriceChange}
            />
            {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
            <input type="text" placeholder="Time" className="input border border-primary" onChange={handleTimeChange} />
            {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Submit bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidMenu;

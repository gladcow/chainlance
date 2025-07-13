import React from "react";
import { useState } from "react";
import { DescriptionField, PriceField, TimeField } from "./InputFields";
import { placeBid } from "./placeBid";
import { timeDecider } from "./utils";
import { Bee } from "@ethersphere/bee-js";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";

interface BidMenuProps {
  onClose: () => void;
  project_id: string;
  storage: Bee | undefined;
  original_price: string;
  original_time: string;
  stamp: string;
}

const BidMenu: React.FC<BidMenuProps> = ({ onClose, project_id, storage, original_price, original_time, stamp }) => {
  const [projectDescription, setProjectDescription] = useState("");
  const [timeSpan, setTimeSpan] = useState(Number(original_time));
  const [price, setPrice] = useState(original_price);
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [timeMult, setTimeMult] = useState("hours");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "bidProject",
    args: [] as unknown as [string, string, bigint, number],
  });
  const handleSubmit = () => {
    placeBid(project_id, projectDescription, timeSpan, price, writeAsync, storage, stamp);
    onClose();
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      Number(value);
      setPriceError("");
    } else {
      setPriceError("Price must be an number.");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTimeSpan(timeDecider(timeMult, Number(value)));
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
            <h2 className="card-title">Place Your Bid</h2>
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
            <DescriptionField setDescription={setProjectDescription}></DescriptionField>

            <PriceField
              handlePriceChange={handlePriceChange}
              priceError={priceError}
              value={original_price}
            ></PriceField>

            <TimeField
              handleTimeChange={handleTimeChange}
              setTimeMult={setTimeMult}
              timeMult={timeMult}
              timeError={timeError}
              value={original_time}
            ></TimeField>
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

import React, { useState } from "react";
import { DescriptionField, PriceField, TimeField } from "./InputFields";
import { subCreate } from "./SubCreate";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";

interface BidMenuProps {
  onClose: () => void;
  project_id: string;
  title: string;
  storage: any;
}

const SubCreateMenu: React.FC<BidMenuProps> = ({ onClose, project_id, title, storage }) => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [timeSpan, setTimeSpan] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [timeMult, setTimeMult] = useState("hours");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "createSubproject",
    args: [] as unknown as [string, string, bigint, number],
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      Number(value);
      setPriceError("");
    } else {
      setPriceError("Price must be an number");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTimeSpan(Number(value));
      setTimeError("");
    } else {
      setTimeError("Time must be an integer");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subCreate(title, timeMult, project_id, description, price, timeSpan, writeAsync, storage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Create Subproject</h2>
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
          <div className="card-actions justify-end">
            <DescriptionField setDescription={setDescription}></DescriptionField>

            <PriceField handlePriceChange={handlePriceChange} priceError={priceError}></PriceField>

            <TimeField
              handleTimeChange={handleTimeChange}
              setTimeMult={setTimeMult}
              timeMult={timeMult}
              timeError={timeError}
            ></TimeField>
            {true && (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={!!priceError || !!timeError}>
                {isLoading ? <span className="loading loading-spinner loading-sm m-5"></span> : <>Create Subproject</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCreateMenu;

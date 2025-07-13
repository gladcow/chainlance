import { Dispatch, SetStateAction, useState } from "react";
import { DescriptionField, PriceField, TimeField, TitleField } from "./InputFields";
import { timeDecider } from "./utils";
import { Bee } from "@ethersphere/bee-js";
import { parseEther } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface WriteCreateProjectProps {
  storage: Bee | undefined;
  setCreateMenu: Dispatch<SetStateAction<boolean>>;
  stamp: string;
}

export const WriteCreateProject = ({ storage, setCreateMenu, stamp }: WriteCreateProjectProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [timeSpan, setTimeSpan] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [timeMult, setTimeMult] = useState("hours");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ChainLance",
    functionName: "createProject",
    args: [] as unknown as [string, bigint, number],
  });

  const writeProjectDetailsToStorage = async function () {
    const calculatedTime = timeDecider(timeMult, timeSpan);
    const res = await storage?.uploadData(
      stamp,
      JSON.stringify({
        title,
        description,
        short_description: description.slice(0, 500),
        price,
        timeSpan: calculatedTime,
      }),
    );

    const id = res?.reference.toString();
    writeAsync({
      args: [id, parseEther(price), Math.round(calculatedTime)],
    });
  };

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
            <TitleField setTitle={setTitle}></TitleField>

            <DescriptionField setDescription={setDescription}></DescriptionField>

            <PriceField handlePriceChange={handlePriceChange} priceError={priceError}></PriceField>

            <TimeField
              handleTimeChange={handleTimeChange}
              setTimeMult={setTimeMult}
              timeMult={timeMult}
              timeError={timeError}
            ></TimeField>
            {true && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  writeProjectDetailsToStorage();
                  setCreateMenu(false);
                }}
                disabled={!!priceError || !!timeError}
              >
                {isLoading ? <span className="loading loading-spinner loading-sm m-5"></span> : <>Create Project</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

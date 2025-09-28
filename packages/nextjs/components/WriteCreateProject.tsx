import { Dispatch, SetStateAction, useState } from "react"
import { DescriptionField, PriceField, TimeField, TitleField } from "./InputFields"
import { timeDecider } from "./Utils"
import { Bee } from "@ethersphere/bee-js"
import { parseEther } from "viem"
import { useContractWrite } from "@/hooks/useContractWrite"
// import pako from "pako"

interface WriteCreateProjectProps {
  storage: Bee | undefined;
  setCreateMenu: Dispatch<SetStateAction<boolean>>;
  storageStamp: string;
}

export const WriteCreateProject = ({ storage, setCreateMenu, storageStamp }: WriteCreateProjectProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [timeSpan, setTimeSpan] = useState(0);
  const [priceError, setPriceError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [timeMult, setTimeMult] = useState("hours");
  const [files, setFiles] = useState<File[]>([]);

  const { write, loading } = useContractWrite({
    functionName: "createProject",
    args: [] as unknown as [string, bigint, number],
  });

  const uploadFilesToSwarm = async (): Promise<string[]> => {
    if (!storage) return []

    const hashes: string[] = []
    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        throw new Error(`file ${file.name} too big (max 50MB)`)
      }

      const buffer = await file.arrayBuffer()
      const data = new Uint8Array(buffer)
      // data = pako.gzip(data)

      const res = await storage?.uploadFile(storageStamp, data, file.name, 
      {
        contentType: file.type,
      })
      hashes.push(res?.reference.toString())
    }
    return hashes
  }
  const writeProjectDetailsToStorage = async function () {
    const calculatedTime = timeDecider(timeMult, timeSpan);
    const attachments = await uploadFilesToSwarm()
    const res = await storage?.uploadData(
      storageStamp,
      JSON.stringify({
        title,
        description,
        short_description: description.slice(0, 500),
        price,
        timeSpan: calculatedTime,
        attachments,
      }),
    );

    const id = res?.reference.toString();
    if (!id) return
    write({
      args: [id, parseEther(price), Math.round(calculatedTime)],
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setPriceError("");
    } else {
      setPriceError("Price must be a number");
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
  }

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
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
            <TitleField setTitle={setTitle} />

            <DescriptionField setDescription={setDescription} />

            <PriceField handlePriceChange={handlePriceChange} priceError={priceError} />

            <TimeField handleTimeChange={handleTimeChange} setTimeMult={setTimeMult} timeMult={timeMult} timeError={timeError} />

            <div className="w-full">
              <label className="label">Attachments</label>
              <input type="file" multiple onChange={handleFilesChange} className="file-input file-input-bordered w-full" />
              {files.length > 0 && (
                <ul className="mt-2 text-sm max-h-24 overflow-y-auto">
                  {files.map((f, i) => (
                    <li key={i}>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="btn btn-primary mt-4"
              onClick={async () => {
                try {
                  await writeProjectDetailsToStorage();
                  setCreateMenu(false);
                } catch (err) {
                  alert("err: " + err);
                }
              }}
              disabled={!!priceError || !!timeError}
            >
              {loading ? <span className="loading loading-spinner loading-sm m-5"></span> : <>Create Project</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
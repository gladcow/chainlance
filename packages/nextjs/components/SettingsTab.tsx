import { Bee } from "@ethersphere/bee-js";
import { Dispatch, SetStateAction, useState } from "react";

interface SettingTabProps {
setStorageAddress: Dispatch<SetStateAction<string>>;
storageAdress: string;
setStorageStamp:  Dispatch<SetStateAction<string>>;
storageStamp: string;
setStorage: Dispatch<SetStateAction<Bee | undefined>>;
}

export const SettingsTab = ({ setStorageAddress, storageAdress, setStorageStamp, storageStamp, setStorage }: SettingTabProps) => {
  
  const [localAddress, setLocalAddress] = useState(storageAdress);
  const [localStamp, setLocalStamp] = useState(storageStamp);

  const handleSave = () => {
    setStorageAddress(localAddress);
    setStorageStamp(localStamp);

    try {
      setStorage(new Bee(localAddress));
    } catch (err) {
      console.log(err)
      setStorage(new Bee("http://92.63.194.135:3000"));
    }
  };

  return (
    <div className="card bg-base-100 w-96 m-5 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Storage Settings</h2>
        <p>Change storage url</p>
        <input
          type="text"
          value={localAddress}
          className="input border border-primary"
          onChange={(e) => setLocalAddress(e.target.value)}
        />
        <p>Change storage stamp</p>
        <input
          type="text"
          value={localStamp}
          className="input border border-primary"
          onChange={(e) => setLocalStamp(e.target.value)}
        />
        <div className="mt-3 flex justify-start">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
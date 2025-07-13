import { Dispatch, SetStateAction, useState } from "react";

interface SettingProps {
  stamp: string;
  setStamp: Dispatch<SetStateAction<string>>;
  storageURL: string;
  setStorageURL: Dispatch<SetStateAction<string>>;
}

export const SettingsTab: React.FC<SettingProps> = ({ stamp, setStamp, storageURL, setStorageURL }) => {
  const [localStamp, setLocalStamp] = useState(stamp);
  const [localStorageURL, setLocalStorageURL] = useState(storageURL);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isValidURL = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };
  const isURLValid = isValidURL(localStorageURL);

  const handleSave = () => {
    if (!isURLValid) return;

    setIsSaving(true);
    setTimeout(() => {
      setStorageURL(localStorageURL);
      setStamp(localStamp);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 500);
  };

  return (
    <div className="card bg-base-100 w-96 m-5 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Storage Settings</h2>

        <p>Change storage URL</p>
        <input
          type="text"
          placeholder="URL"
          className="input border border-primary"
          value={localStorageURL}
          onChange={e => setLocalStorageURL(e.target.value)}
        />

        <p>Change storage stamp</p>
        <input
          type="text"
          placeholder="Stamp"
          className="input border border-primary"
          value={localStamp}
          onChange={e => setLocalStamp(e.target.value)}
        />

        <div className="card-actions justify-end mt-4 relative group">
          <button
            onClick={handleSave}
            disabled={!isURLValid || isSaving}
            className={`btn transition-all duration-300 ${isSaved ? "bg-green-500 hover:bg-green-600" : "btn-primary"}`}
          >
            {isSaving ? (
              <span className="loading loading-spinner" />
            ) : isSaved ? (
              <span>✅ Saved</span>
            ) : (
              <span>Save</span>
            )}
          </button>

          {!isURLValid && (
            <div className="absolute -top-8 right-0 hidden group-hover:block">
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow">Invalid URL</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

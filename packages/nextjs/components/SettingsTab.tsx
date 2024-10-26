export const SettingsTab = () => {
  return (
    <div className="card bg-base-100 w-96 m-5 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Storage Settings</h2>
        <p>Change storage url</p>
        <input
          type="text"
          placeholder="Url"
          className="input border border-primary"
          onChange={e => {
            console.log(e.target.value);
          }}
        />
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              console.log("saved?");
            }}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export const TabButton: React.FC<any> = ({ tab, setTab, name, readName }) => {
  return (
    <button
      className={`relative h-[3.5rem] btn rounded-[40%] rounded-b-none border-2 shadow-none ${
        tab === name
          ? "btn-base-500 border-2 pt-[2px] !shadow-none"
          : "bg-base-100 border-base-100 !shadow-none hover:btn-base-500 hover:border-b-success hover:border-2 hover:bg-secondary-500"
      }`}
      onClick={() => setTab(name)}
    >
      {tab === name && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary-1000"></div>}
      {readName}
    </button>
  );
};

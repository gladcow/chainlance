import { Dispatch, SetStateAction } from "react";

interface TabButtonProps {
  tab: {id: string, from?: string, state?: string};
  setTab: Dispatch<SetStateAction<{
    id: string;
    from?: string;
    state?: string;
  }>>;
  name: string;
  readName: string;
}

export const TabButton: React.FC<TabButtonProps> = ({ tab, setTab, name, readName }) => {
  return (
    <button
      className={`relative h-[3.5rem] btn rounded-[40%] rounded-b-none border-2 shadow-none ${
        tab.id === name
          ? "bg-base-100 border-base-100 border-2 pt-[2px] !shadow-none"
          : "bg-base-200 border-base-300 !shadow-none hover:btn-base-500 hover:border-b-success hover:border-2 hover:bg-secondary-500"
      }`}
      onClick={() => setTab({id: name})}
    >
      {tab.id === name && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary-1000"></div>}
      {readName}
    </button>
  );
};
import React, { Dispatch, SetStateAction } from "react";
import { TabButton } from "./TabButton"

interface NavBarChainProps {
  tab: {id: string, from?: string, state?: string};
  setTab: Dispatch<SetStateAction<{ id: string; from?: string; state?: string; }>>;
  connect: () => Promise<void>;
  address?: string;
  chainId: string | null;
  switchNetwork: () => Promise<void>;
}

export const NavBarChain = ({ tab, setTab, connect, address, chainId, switchNetwork }: NavBarChainProps) => {
  return (
    <div className="navbar bg-base-300 mb-2 pb-[0px] flex justify-between">
      <div className="gap-2 mb-0 pb-0">
        <TabButton tab={tab} setTab={setTab} name={"main"} readName={"Main page"}></TabButton>

        <TabButton tab={tab} setTab={setTab} name={"worker"} readName={"Worker"}></TabButton>

        <TabButton tab={tab} setTab={setTab} name={"employer"} readName={"Employer"}></TabButton>

        <TabButton tab={tab} setTab={setTab} name={"settings"} readName={"Storage settings"}></TabButton>
      </div>
      <div className="flex gap-2 pr-4">
        <button className="btn btn-sm btn-primary" onClick={connect}>
          {address ? address.slice(0, 6) + "..." + address.slice(-4) : "Connect Wallet"}
        </button>

        <button className="btn btn-sm btn-primary" onClick={switchNetwork}>
          {chainId === "100" ? "On Gnosis" : "Switch to Gnosis"}
        </button>
      </div>
    </div>
  );
};
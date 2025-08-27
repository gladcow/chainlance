import React, { Dispatch, SetStateAction } from "react";
import { TabButton } from "./TabButton"

interface NavBarChainProps {
  tab: {id: string, from?: string, state?: string};
  setTab: Dispatch<SetStateAction<{ id: string; from?: string; state?: string; }>>;
}

export const NavBarChain = ({ tab, setTab }: NavBarChainProps) => {
  return (
    <div className="navbar bg-base-300 mb-2 pb-[0px] flex justify-between">
      <div className="gap-2 mb-0 pb-0">
        <TabButton tab={tab} setTab={setTab} name={"main"} readName={"Main page"}></TabButton>

        <TabButton tab={tab} setTab={setTab} name={"worker"} readName={"Worker"}></TabButton>

        <TabButton tab={tab} setTab={setTab} name={"employer"} readName={"Employer"}></TabButton>

        <TabButton tab={tab} setTab={setTab} name={"settings"} readName={"Storage settings"}></TabButton>
      </div>
    </div>
  );
};
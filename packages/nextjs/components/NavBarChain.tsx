import React from "react";
import { SettingsMenu } from "./SettingIpfsMenu";

interface NavBarChainProps {
  tab: string;
  setTab: (tab: string) => void;
}

export const NavBarChain = ({ tab, setTab }: NavBarChainProps) => {
  return (
    <div className="navbar shadow-md bg-base-100 m-2 flex justify-between">
      <div>
        <button className={`btn ${tab === "main" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("main")}>
          Main
        </button>
        <button className={`btn ${tab === "worker" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("worker")}>
          Worker
        </button>
        <button
          className={`btn ${tab === "employer" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("employer")}
        >
          Employer
        </button>
      </div>
      <div className="flex-none">
        <SettingsMenu />
      </div>
    </div>
  );
};

import React from "react";
import { SettingsMenu } from "./SettingsMenu";

interface NavBarChainProps {
  tab: string;
  setTab: (tab: string) => void;
}

export const NavBarChain = ({ tab, setTab }: NavBarChainProps) => {
  return (
    <div className="navbar shadow-md bg-base-100 p-2 mt-2 mb-2 flex justify-between">
      <div className="gap-2">
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
        <button
          className={`btn ${tab === "settings" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("settings")}
        >
          Storage Settings
        </button>
      </div>
      <div className="flex-none">
        <SettingsMenu />
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { Bee } from "@ethersphere/bee-js";
import type { NextPage } from "next";
import { useEffectOnce } from "usehooks-ts";
import { useAccount } from "wagmi";
import { MainTab } from "~~/components/MainTab";
import { NavBarChain } from "~~/components/NavBarChain";
import ProjectPage from "~~/components/ProjectPage";
import { SettingsTab } from "~~/components/SettingsTab";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const { address: connectedAddress } = useAccount();
  const [storage, setStorage] = useState<Bee>();

  useEffectOnce(() => {
    setStorage(new Bee("http://92.63.194.135:3000"));
  });

  const table_columns = ["title", "timeSpan", "price"];
  const [projectId] = useState("");
  const {} = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [projectId],
    watch: true,
  });

  return (
    <>
      <NavBarChain tab={tab} setTab={setTab}></NavBarChain>
      <div className="flex flex-row items-start h-96">
        {tab === "main" && (
          <>
            <MainTab></MainTab>
          </>
        )}
        {tab === "worker" && (
          <>
            <UserWorker
              address={connectedAddress}
              columns={table_columns}
              storage={storage}
              setTab={setTab}
            ></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer
              address={connectedAddress}
              columns={table_columns}
              storage={storage}
              setTab={setTab}
            ></UserEmployer>
          </>
        )}

        {tab === "settings" && (
          <>
            <SettingsTab></SettingsTab>
          </>
        )}
        {tab != "main" && tab != "worker" && tab != "employer" && tab != "settings" && (
          <>
            <ProjectPage project={tab} storage={storage}></ProjectPage>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

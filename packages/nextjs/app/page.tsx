"use client";

import { useEffect, useState } from "react";
import { Bee } from "@ethersphere/bee-js";
import type { NextPage } from "next";
import { useEffectOnce } from "usehooks-ts";
import { useAccount } from "wagmi";
import { MainTab } from "~~/components/MainTab";
import { NavBarChain } from "~~/components/NavBarChain";
import { SettingsTab } from "~~/components/SettingsTab";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import ProjectPage from "~~/components/tableComponents/ProjectPage";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const { address: connectedAddress } = useAccount();
  const [storage, setStorage] = useState<Bee>();
  const [stamp, setStamp] = useState<string>("");
  const [storageURL, setStorageURL] = useState<string>("http://92.63.194.135:3000");

  useEffectOnce(() => {
    setStorage(new Bee("http://92.63.194.135:3000"));
    setStamp("f1e4ff753ea1cb923269ed0cda909d13a10d624719edf261e196584e9e764e50");
  });
  useEffect(() => {
    setStorage(new Bee(storageURL));
  }, [storageURL]);

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
            <UserWorker address={connectedAddress} storage={storage} setTab={setTab} stamp={stamp}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer address={connectedAddress} storage={storage} setTab={setTab} stamp={stamp}></UserEmployer>
          </>
        )}

        {tab === "settings" && (
          <>
            <SettingsTab
              stamp={stamp}
              setStamp={setStamp}
              storageURL={storageURL}
              setStorageURL={setStorageURL}
            ></SettingsTab>
          </>
        )}
        {tab != "main" && tab != "worker" && tab != "employer" && tab != "settings" && (
          <>
            <ProjectPage project={tab} storage={storage} setTab={setTab}></ProjectPage>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

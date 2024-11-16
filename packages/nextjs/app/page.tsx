"use client";

import { useState } from "react";
import { Bee } from "@ethersphere/bee-js";
import type { NextPage } from "next";
import { useEffectOnce } from "usehooks-ts";
import { useAccount } from "wagmi";
import { MainTab } from "~~/components/MainTab";
import { NavBarChain } from "~~/components/NavBarChain";
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

  const columns = ["title", "description"];
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
            <UserWorker columns={columns} storage={storage}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer address={connectedAddress} columns={columns} storage={storage}></UserEmployer>
          </>
        )}

        {tab === "settings" && (
          <>
            <SettingsTab></SettingsTab>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

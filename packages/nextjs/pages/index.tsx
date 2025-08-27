"use client";

import { useState } from "react";
import { Bee } from "@ethersphere/bee-js";
import type { NextPage } from "next";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { useWallet } from "@/hooks/useWallet";
import { MainTab } from "@/components/MainTab";
import { NavBarChain } from "@/components/NavBarChain";
import { Footer } from "@/components/Footer";
import { SettingsTab } from "@/components/SettingsTab";
import { UserWorker } from "@/components/UserWorker";
import { UserEmployer } from "@/components/UserEmployer";
import ProjectPage from "@/components/tableComponents/ProjectPage";

const Home: NextPage = () => {
  const [tab, setTab] = useState<{id: string, from?: string, state?: string}>({id: "main", from:'', state:''});
  const { address: connectedAddress } = useWallet();

  const [storage, setStorage] = useState<Bee>();

  useEffectOnce(() => {
    setStorage(new Bee("http://92.63.194.135:3000"));
    
  });

  return (
    <>
      <NavBarChain tab={tab} setTab={setTab}></NavBarChain>
      <div className="flex flex-row items-start h-96">
        {tab.id === "main" && (
          <>
            <MainTab></MainTab>
          </>
        )}
        {tab.id === "worker" && (
          <>
            <UserWorker address={connectedAddress} storage={storage} setTab={setTab}></UserWorker>
          </>
        )}

        {tab.id === "employer" && (
          <>
            <UserEmployer address={connectedAddress} storage={storage} setTab={setTab}></UserEmployer>
          </>
        )}

        {tab.id === "settings" && (
          <>
            <SettingsTab></SettingsTab>
          </>
        )}
        {tab.id != "main" && tab.id != "worker" && tab.id != "employer" && tab.id != "settings" && (
          <>
            <ProjectPage project={tab} storage={storage} setTab={setTab}></ProjectPage>
          </>
        )}
      </div>
        <Footer></Footer>
    </>
  );
};

export default Home;
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
  const { address: connectedAddress, connect, switchNetwork, chainId } = useWallet();

  const [storage, setStorage] = useState<Bee>();
  const [storageAdress, setStorageAdress] = useState<string>('');
  const [storageStamp, setStorageStamp] = useState<string>('');

  useEffectOnce(() => {
    setStorageAdress("http://92.63.194.135:3000")
    setStorageStamp("f1e4ff753ea1cb923269ed0cda909d13a10d624719edf261e196584e9e764e50")
  });
  useEffectOnce(() => {
    setStorage(new Bee("http://92.63.194.135:3000"));
  })

  return (
    <>
      <NavBarChain tab={tab} setTab={setTab} connect={connect} address={connectedAddress} chainId={chainId} switchNetwork={switchNetwork}></NavBarChain>
      <div className="flex flex-row items-start h-96">
        {tab.id === "main" && (
          <>
            <MainTab></MainTab>
          </>
        )}
        {tab.id === "worker" && (
          <>
            <UserWorker address={connectedAddress} storage={storage} storageAddress={storageAdress} setTab={setTab} storageStamp={storageStamp}></UserWorker>
          </>
        )}

        {tab.id === "employer" && (
          <>
            <UserEmployer address={connectedAddress} storage={storage} setTab={setTab} storageStamp={storageStamp}></UserEmployer>
          </>
        )}

        {tab.id === "settings" && (
          <>
            <SettingsTab setStorageStamp={setStorageStamp} setStorageAdress={setStorageAdress} 
            storageAdress={storageAdress} storageStamp={storageStamp} setStorage={setStorage}></SettingsTab>
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
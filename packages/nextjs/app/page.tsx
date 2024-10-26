"use client";

import { useEffect, useState } from "react";
import { Bee } from "@ethersphere/bee-js";
import { KuboRPCClient, create } from "kubo-rpc-client";
import type { NextPage } from "next";
import { useEffectOnce } from "usehooks-ts";
import { MainTab } from "~~/components/MainTab";
import { NavBarChain } from "~~/components/NavBarChain";
import { SettingsTab } from "~~/components/SettingsTab";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const [ipfsNode, setIpfsNode] = useState<KuboRPCClient>();
  const [storage, setStorage] = useState<Bee>();
  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  }) as { data: any[] | undefined };

  useEffectOnce(() => {
    setStorage(new Bee("http://92.63.194.135:3000"));
  });

  useEffect(() => {
    if (ipfsNode === undefined) {
      const ipfs = create({
        host: "92.63.194.135",
        port: 5001,
        protocol: "http",
      });
      setIpfsNode(ipfs);
    }
  }, [ipfsNode]);

  const data = projectlist
    ? projectlist.map(projectId => ({
        id: projectId,
      }))
    : [];
  const columns = ["id"];

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
            <UserWorker data={data} columns={columns} storage={storage}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={data} columns={columns} storage={storage}></UserEmployer>
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

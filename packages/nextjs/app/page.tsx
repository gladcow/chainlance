"use client";

import { useEffect, useState } from "react";
import { KuboRPCClient, create } from "kubo-rpc-client";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MainTab } from "~~/components/MainTab";
import { NavBarChain } from "~~/components/NavBarChain";
import { SettingsTab } from "~~/components/SettingsTab";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const [ipfsNode, setIpfsNode] = useState<KuboRPCClient>();
  const { address: connectedAddress } = useAccount();

  const { data: owner_projects } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listOwnerProjects",
    args: [connectedAddress],
  }) as { data: any[] | undefined };

  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  }) as { data: any[] | undefined };

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

  const all_open_projects = projectlist
    ? projectlist.map(projectId => ({
        id: projectId,
      }))
    : [];

  const all_owner_projects = owner_projects
    ? owner_projects.map(projectId => ({
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
            <UserWorker data={all_open_projects} columns={columns} ipfsNode={ipfsNode}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={all_owner_projects} columns={columns} ipfsNode={ipfsNode}></UserEmployer>
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

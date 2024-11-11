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

  const { data: owner_projects } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listOwnerProjects",
    args: [connectedAddress],
  }) as { data: any[] | undefined };

  const [storage, setStorage] = useState<Bee>();
  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  }) as { data: any[] | undefined };

  useEffectOnce(() => {
    setStorage(new Bee("http://92.63.194.135:3000"));
  });

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
            <UserWorker data={all_open_projects} columns={columns} storage={storage}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={all_owner_projects} columns={columns} storage={storage}></UserEmployer>
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

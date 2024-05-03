"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { NavBarChain } from "~~/components/NavBarChain";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");

  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  });

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
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p>
                Chainlance is a decentralized freelance marketplace. Chainlance sets itself apart from other freelance
                marketplaces by prioritizing collaboration among freelancers rather than fostering competition.
              </p>
              <p>
                At the core of Chainlance&apos;s strategy to foster unity among freelancers is the encouragement of
                project division and the sharing of subprojects with other freelancers.
              </p>
              <p>
                Please switch to the &apos;Worker&apos; or &apos;Employer&apos; tab to either start working or to create
                a project.
              </p>
            </div>
          </div>
        )}

        {tab === "worker" && (
          <>
            <UserWorker data={data} columns={columns}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={data} columns={columns}></UserEmployer>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

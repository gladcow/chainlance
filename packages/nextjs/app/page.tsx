"use client";

import { useEffect, useState } from "react";
import { KuboRPCClient, create } from "kubo-rpc-client";
import type { NextPage } from "next";
import { NavBarChain } from "~~/components/NavBarChain";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const [ipfsNode, setIpfsNode] = useState<KuboRPCClient>();

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
            <div className="card-body relative">
              <div className="absolute top-2 right-2">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <a>Setting 1</a>
                    </li>
                    <li>
                      <a>Setting 2</a>
                    </li>
                    <li>
                      <a>Setting 3</a>
                    </li>
                  </ul>
                </div>
              </div>
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
            <UserWorker data={data} columns={columns} ipfsNode={ipfsNode}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={data} columns={columns} ipfsNode={ipfsNode}></UserEmployer>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

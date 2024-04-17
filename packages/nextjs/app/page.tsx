"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { NavBarChain } from "~~/components/NavBarChain";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const [project, setProject] = useState("");

  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  });

  const { data: infoFull } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [project],
  }) as { data: any[] | undefined; isLoading: boolean };

  const data = projectlist
    ? projectlist.map(projectId => ({
        id: projectId,
        info: (
          <button
            className="btn btn-primary"
            onClick={() => {
              setProject(projectId);
            }}
          >
            View Details
          </button>
        ),
      }))
    : [];
  const columns = ["id", "info"];

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
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <p>Hello it is main page ChainLance</p>
            </div>
          </div>
        )}

        {tab === "worker" && (
          <>
            <UserWorker data={data} columns={columns} info={infoFull ? infoFull : []}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={data} columns={columns} info={infoFull}></UserEmployer>
          </>
        )}
        {/* <WriteCreateProject></WriteCreateProject>
        <ReadProjects></ReadProjects>
        <ShowInfoCard info={info}></ShowInfoCard>
        <Table data={data}></Table> */}
      </div>
    </>
  );
};

export default Home;

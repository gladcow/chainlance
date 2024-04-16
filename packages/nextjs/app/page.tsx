"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { ReadProjects } from "~~/components/ReadProjects";
import { WriteCreateProject } from "~~/components/WriteCreateProject";
import { Table } from "~~/components/table";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [projectId] = useState("");

  const {} = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [projectId],
    watch: true,
  });

  return (
    <>
      <div className="flex flex-row items-start h-96">
        <WriteCreateProject></WriteCreateProject>
        <ReadProjects></ReadProjects>
        <Table></Table>
      </div>
    </>
  );
};

export default Home;

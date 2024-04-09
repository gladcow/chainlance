"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { ReadBids } from "~~/components/ReadBids";
import { ReadProjects } from "~~/components/ReadProjects";
import { WriteCreateProject } from "~~/components/WriteCreateProject";
import { WriteSubmitWork } from "~~/components/WriteSubmitWork";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [projectId] = useState(0);

  const {} = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [BigInt(projectId)],
    watch: true,
  });

  return (
    <>
      <div className="flex items-center flex-row flex-grow pt-10 m-10">
        <ReadProjects></ReadProjects>
        <ReadBids></ReadBids>
        <WriteSubmitWork></WriteSubmitWork>
        <WriteCreateProject></WriteCreateProject>
      </div>
    </>
  );
};

export default Home;

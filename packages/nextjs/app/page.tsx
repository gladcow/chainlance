"use client";

import { useEffect, useState } from "react";
import { IDBBlockstore } from "blockstore-idb";
import { IDBDatastore } from "datastore-idb";
import { createHelia } from "helia";
import type { NextPage } from "next";
import { NavBarChain } from "~~/components/NavBarChain";
import { UserWorker } from "~~/components/User_Worker";
import { UserEmployer } from "~~/components/User_employer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [tab, setTab] = useState("main");
  const [nodeId, setId] = useState("");
  const [helia, setHelia] = useState({});
  const [heliaOnline, setHeliaOnline] = useState(false);
  const [blockstore, setBlockstore] = useState({});
  const [datastore, setDatastore] = useState({});

  const { data: projectlist } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  });

  useEffect(() => {
    const init = async () => {
      if (nodeId.length > 0) return;
      const blockstore = new IDBBlockstore("/ipfs_test/blockstore");
      await blockstore.open();
      setBlockstore(blockstore);
      const datastore = new IDBDatastore("/ipfs_test/datastore");
      await datastore.open();
      setDatastore(datastore);

      const heliaNode = await createHelia({
        datastore: datastore,
        blockstore: blockstore,
      });

      const id = heliaNode.libp2p.peerId.toString();
      const nodeIsOnline = heliaNode.libp2p.status === "started";

      setHelia(heliaNode);
      setId(id);
      setHeliaOnline(nodeIsOnline);
    };

    init();

    // return () => {
    //   if (nodeId.length > 0) {
    //     // @ts-ignore
    //     helia.stop();
    //     // @ts-ignore
    //     datastore.close();
    //     // @ts-ignore
    //     blockstore.close();
    //     setHeliaOnline(false);
    //     setId("");
    //   }
    // };
  }, [blockstore, datastore, helia, nodeId]);

  const data = projectlist
    ? projectlist.map(projectId => ({
        id: projectId,
        //id: <ProjectTitleFromId projectId={projectId} helia={helia} heliaOnline={heliaOnline}></ProjectTitleFromId>,
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
            <UserWorker data={data} columns={columns} helia={helia} heliaOnline={heliaOnline}></UserWorker>
          </>
        )}

        {tab === "employer" && (
          <>
            <UserEmployer data={data} columns={columns} helia={helia} heliaOnline={heliaOnline}></UserEmployer>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { CID, KuboRPCClient } from "kubo-rpc-client";

const fetchProjectTitleFromId = async (ipfsNode: KuboRPCClient | undefined, projectId: string) => {
  if (!(await ipfsNode?.isOnline())) return "";
  const cid = CID.parse(projectId);
  const data = ipfsNode?.get(cid);
  if (data === undefined) {
    return "";
  }
  let resString = "";
  for await (const x of data) {
    const chunk = new TextDecoder().decode(x);
    resString += chunk;
  }
  // dirty hack
  const bodyString = resString.substring(resString.indexOf("{", 0), resString.lastIndexOf("}") + 1);
  const parsedData = JSON.parse(bodyString);
  return parsedData.title;
};

const useFetchTitles = (data: any[], ipfsNode: KuboRPCClient | undefined) => {
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAllTitles = async () => {
      const titlesTemp: { [key: string]: string } = {};
      for (const row of data) {
        const title = await fetchProjectTitleFromId(ipfsNode, row.id);
        titlesTemp[row.id] = title;
      }
      setTitles(titlesTemp);
    };

    fetchAllTitles();
  }, [data, ipfsNode]);

  return titles;
};

export { useFetchTitles };

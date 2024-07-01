import { useEffect, useState } from "react";
import { CID, KuboRPCClient } from "kubo-rpc-client";

const useFetchTitles = (data: any[], ipfsNode: KuboRPCClient | undefined) => {
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTitle = async (projectId: string) => {
      if (titles[projectId]) return titles[projectId];
      if (!(await ipfsNode?.isOnline())) return "";

      const cid = CID.parse(projectId);
      const data = ipfsNode?.get(cid);
      if (data === undefined) {
        return;
      }
      let resString = "";
      for await (const x of data) {
        const chunk = new TextDecoder().decode(x);
        resString += chunk;
      }
      // dirty hack
      const bodyString = resString.substring(resString.indexOf("{", 0), resString.lastIndexOf("}") + 1);
      const parsedData = JSON.parse(bodyString);
      const title = parsedData.title;

      setTitles(prevTitles => ({ ...prevTitles, [projectId]: title }));
      return title;
    };

    const fetchAllTitles = async () => {
      const titlesTemp: { [key: string]: string } = {};
      for (const row of data) {
        const title = await fetchTitle(row.id);
        titlesTemp[row.id] = title;
      }
      setTitles(titlesTemp);
    };

    fetchAllTitles();
  }, [data, ipfsNode, titles]);

  return titles;
};
export { useFetchTitles };

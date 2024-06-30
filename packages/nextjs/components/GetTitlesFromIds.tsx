import { useEffect, useState } from "react";
import { json } from "@helia/json";
import { CID } from "multiformats";

const useFetchTitles = (data: any[], helia: any, heliaOnline: boolean) => {
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTitle = async (projectId: string) => {
      if (titles[projectId]) return titles[projectId];
      if (!heliaOnline) return "";

      const j = json(helia);
      const cid = CID.parse(projectId);
      // @ts-ignore
      const data = await j.get(cid);
      // @ts-ignore
      const title = data.title;

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

    if (heliaOnline) {
      fetchAllTitles();
    }
  }, [titles, data, helia, heliaOnline]);

  return titles;
};
export { useFetchTitles };

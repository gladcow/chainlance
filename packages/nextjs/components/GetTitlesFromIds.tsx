import { useEffect, useState } from "react";
import { Bee } from "@ethersphere/bee-js";

const fetchProjectTitleFromId = async (storage: Bee | undefined, projectId: string) => {
  if (!storage) return "";
  const data = await storage?.downloadData(projectId);
  if (data === undefined) {
    return "";
  }
  const parsedData = data.json();
  return parsedData.title ? parsedData.title.toString() : "";
};

const useFetchTitles = (data: any[], storage: Bee | undefined) => {
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAllTitles = async () => {
      const titlesTemp: { [key: string]: string } = {};
      for (const row of data) {
        const title = await fetchProjectTitleFromId(storage, row.id);
        titlesTemp[row.id] = title;
      }
      setTitles(titlesTemp);
    };

    fetchAllTitles();
  }, [data, storage]);

  return titles;
};

export { useFetchTitles };

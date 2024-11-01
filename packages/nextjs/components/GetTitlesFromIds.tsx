import { useEffect, useState } from "react";
import { Bee } from "@ethersphere/bee-js";

interface ParsedData {
  title: string;
  description: string;
  price: number;
  timeSpan: number;
}

const fetchProjectTitleFromId = async (storage: Bee | undefined, projectId: string, field: keyof ParsedData) => {
  // const field = 'title'
  if (!storage) return "";
  const data = await storage?.downloadData(projectId);
  if (data === undefined) {
    return "";
  }
  const parsedData = data.json() as unknown as ParsedData;

  return parsedData[`${field}`] ? parsedData[`${field}`].toString() : "";

  // return parsedData.title ? parsedData.title.toString() : "";
};

const useFetchTitles = (data: any[], storage: Bee | undefined, field: keyof ParsedData) => {
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAllTitles = async () => {
      const titlesTemp: { [key: string]: string } = {};
      for (const row of data) {
        const title = await fetchProjectTitleFromId(storage, row.id, field);
        titlesTemp[row.id] = title;
      }
      setTitles(titlesTemp);
    };

    fetchAllTitles();
  }, [data, storage]);

  return titles;
};

export { useFetchTitles };

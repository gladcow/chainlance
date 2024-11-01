import { useEffect, useState } from "react";
import { Bee } from "@ethersphere/bee-js";

interface ParsedData {
  title: string;
  description: string;
  price: number;
  timeSpan: number;
}

const fetchProjectFieldFromId = async (storage: Bee | undefined, projectId: string, field: keyof ParsedData) => {
  if (!storage) return "";
  const data = await storage?.downloadData(projectId);
  if (data === undefined) {
    return "";
  }
  const parsedData = data.json() as unknown as ParsedData;

  return parsedData[`${field}`] ? parsedData[`${field}`].toString() : "";
};

const useFetchFields = (data: any[], storage: Bee | undefined, this_field: keyof ParsedData) => {
  const [fields, setFields] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAllTitles = async () => {
      const fieldsTemp: { [key: string]: string } = {};
      for (const row of data) {
        const field = await fetchProjectFieldFromId(storage, row.id, this_field);
        fieldsTemp[row.id] = field;
      }
      setFields(fieldsTemp);
    };

    fetchAllTitles();
  }, [data, storage]);

  return fields;
};

export { useFetchFields };

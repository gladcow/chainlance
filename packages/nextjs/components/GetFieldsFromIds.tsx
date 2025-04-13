import { useEffect, useState } from "react";
import { Bee } from "@ethersphere/bee-js";

interface ParsedData {
  title: string;
  description: string;
  price: number;
  timeSpan: number;
  project_id: string;
  short_description: string;
}

const isValidProjectId = (projectId: string): boolean => {
  const isHex = /^[0-9a-fA-F]{64}$/.test(projectId);
  const isEns = /^[a-zA-Z0-9-]+\.eth$/.test(projectId);
  return isHex || isEns;
};

const fetchProjectFieldFromId = async (storage: Bee | undefined, projectId: string, field: keyof ParsedData) => {
  if (!storage || !isValidProjectId(projectId)) return "";

  try {
    const data = await storage.downloadData(projectId);
    if (!data) return "";

    const parsedData = data.json() as unknown as ParsedData;
    return parsedData[field]?.toString() || "";
  } catch (error) {
    console.error(`Error fetching project field for projectId "${projectId}":`, error);
    return "";
  }
};

const useFetchFields = (
  data: any[] | undefined,
  storage: Bee | undefined,
  field: keyof ParsedData,
): { [key: string]: string } => {
  const [fields, setFields] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!data || !storage) return;

    let isCancelled = false;

    const fetchAllFields = async () => {
      const fieldsTemp: { [key: string]: string } = {};

      await Promise.all(
        data.map(async projectId => {
          const value = await fetchProjectFieldFromId(storage, projectId, field);
          if (value) {
            fieldsTemp[projectId] = value;
          }
        }),
      );

      if (!isCancelled) {
        setFields(fieldsTemp);
      }
    };

    fetchAllFields();

    return () => {
      isCancelled = true;
    };
  }, [data, storage, field]);

  return fields;
};

export { useFetchFields, fetchProjectFieldFromId };

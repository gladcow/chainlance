import { KuboRPCClient } from "kubo-rpc-client";

export const checkIpfsOnline = async (ipfsNode: KuboRPCClient | undefined): Promise<boolean> => {
  const online = await ipfsNode?.isOnline();
  return online === undefined ? false : online;
};

export const formatTableData = (
  initialData: any[],
  titles: { [key: string]: string },
  searchTerm: string,
  sortConfig: { key: string; direction: "ascending" | "descending" },
) => {
  const sortedData = [...initialData].sort((a, b) => {
    const aValue = titles[a.id] || "";
    const bValue = titles[b.id] || "";
    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return sortedData.filter(item => {
    const title = titles[item.id] || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });
};

export const formatTableData = (
  initialData: any[],
  fields: { [key: string]: string },
  searchTerm: string,
  sortConfig: { key: string; direction: "ascending" | "descending" },
) => {
  const sortedData = [...initialData].sort((a, b) => {
    const aValue = fields[a.id] || "";
    const bValue = fields[b.id] || "";
    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return sortedData.filter(item => {
    const field = fields[item.id] || "";
    return field.toLowerCase().includes(searchTerm.toLowerCase());
  });
};

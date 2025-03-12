export const formatTableData = (
  initialData: any[] | undefined,
  fields: { [key: string]: string },
  searchTerm: string,
  sortConfig: { key: string; direction: "ascending" | "descending" },
) => {
  const dataFormat = initialData
    ? initialData.map(projectId => ({
        id: projectId,
      }))
    : [];

  const sortedData = [...dataFormat].sort((a, b) => {
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

export const formatTableData = (
  initialData: any[] | undefined,
  fields: { [key: string]: string },
  searchTerm: string,
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
      return 1;
    }
    if (aValue > bValue) {
      return -1;
    }
    return 0;
  });

  return sortedData.filter(item => {
    const field = fields[item.id] || "";
    return field.toLowerCase().includes(searchTerm.toLowerCase());
  });
};

interface Projects {
  [projectId: string]: string;
}

interface Bids {
  [bidId: string]: string;
}

interface Result {
  [bidId: string]: string;
}

export function mapBidsToTitles(projects: Projects, bids: Bids): Result {
  return Object.entries(bids).reduce((acc, [bidId, projectId]) => {
    const title = projects[projectId];
    if (title) {
      acc[bidId] = title;
    }
    return acc;
  }, {} as Result);
}

const blockLenInSeconds = 5;

export function timeDecider(timeMult: string, timeSpan: number): number {
  let calculatedTime;
  switch (timeMult) {
    case "hours":
      calculatedTime = (timeSpan * 60 * 60) / blockLenInSeconds;
      break;
    case "days":
      calculatedTime = (timeSpan * 24 * 60 * 60) / blockLenInSeconds;
      break;
    case "months":
      calculatedTime = (timeSpan * 30 * 24 * 60 * 60) / blockLenInSeconds;
      break;
    case "years":
      calculatedTime = (timeSpan * 12 * 30 * 24 * 60 * 60) / blockLenInSeconds;
      break;
    default:
      calculatedTime = 0;
  }
  return calculatedTime;
}

export const timeRetrive = (timeInBlocks: number) => {
  if (timeInBlocks < (60 * 60 * 24) / blockLenInSeconds) {
    return `${(timeInBlocks * blockLenInSeconds) / 60 / 60} hours`;
  }
  if (timeInBlocks < (30 * 60 * 60 * 24) / blockLenInSeconds) {
    return `${(timeInBlocks * blockLenInSeconds) / 60 / 60 / 24} days`;
  }
  if (timeInBlocks < (12 * 30 * 60 * 60 * 24) / blockLenInSeconds) {
    return `${(timeInBlocks * blockLenInSeconds) / 60 / 60 / 24 / 30} month`;
  }
};

export const calculateGradient = (timeValue: number, mounted: boolean, resolvedTheme: string) => {
  if (!mounted) return "";
  const normalized = Math.min(Math.max(timeValue, 0), 1000) / 1000;
  const isDark = resolvedTheme === "dark";

  const [start, end] = isDark
    ? [`hsl(210, 70%, 40%)` as const, `hsl(270, 60%, 40%)` as const]
    : [`hsl(145, 70%, 60%)` as const, `hsl(200, 80%, 60%)` as const];

  const mix = (color1: string, color2: string, factor: number) => {
    const [h1, s1, l1] = color1.match(/\d+/g)!.map(Number);
    const [h2, s2, l2] = color2.match(/\d+/g)!.map(Number);

    const h = h1 + (h2 - h1) * factor;
    const s = s1 + (s2 - s1) * factor;
    const l = l1 + (l2 - l1) * factor;

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return `linear-gradient(
    135deg,
    ${mix(start, end, normalized)},
    ${mix(end, start, normalized)}
  )`;
};

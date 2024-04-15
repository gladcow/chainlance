import React, { ReactElement, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth/useScaffoldContractRead";

interface DataItem {
  id: number;
  watch: ReactElement;
}

const columns = [
  {
    name: "id",
    selector: (row: DataItem) => row.id,
    sortable: true,
  },
  {
    name: "watch info",
    cell: (row: DataItem) => row.watch,
  },
];

const customStyles = {
  // Стили для таблицы
  table: {
    style: {
      backgroundColor: "#385183", // base-100
      color: "#F9FBFF", // base-content
      height: "600px",
    },
  },
  // Стили для заголовков таблицы
  headCells: {
    style: {
      borderRadius: "0px",
      backgroundColor: "#212638", // primary
      color: "#F9FBFF", // primary-content
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
    },
  },
  // Стили для строк таблицы
  rows: {
    style: {
      backgroundColor: "#F9FBFF", // neutral
      color: "#385183", // neutral-content
      minHeight: "72px", // override the row height
    },
  },
  // Стили для ячеек таблицы
  cells: {
    style: {
      backgroundColor: "#2A3655", // base-200
      color: "#F9FBFF", // base-content
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
  subHeader: {
    style: {
      backgroundColor: "#385183", // base-100
      color: "#F9FBFF", // base-content
    },
  },
  header: {
    style: {
      backgroundColor: "#385183", // base-100
      color: "#F9FBFF", // base-content
    },
  },
};

export function Table() {
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState<DataItem[]>([]);
  const [project, setProject] = useState(0);
  const [info, setInfo] = useState("");
  let item = 0;

  const { data: reciept } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "listProjectsWithState",
    args: [0],
  });

  const { data: infoFull } = useScaffoldContractRead({
    contractName: "ChainLance",
    functionName: "projects",
    args: [BigInt(project)],
  });

  const dataItems: DataItem[] = useMemo(() => {
    const items: DataItem[] = [];
    if (reciept) {
      for (let i = 0; i < reciept.length; i++) {
        item = Number(reciept[i]);

        const currentProject = Number(item);

        const dataItem: DataItem = {
          id: currentProject,
          watch: (
            <button
              className="btn btn-primary"
              onClick={() => {
                const now = currentProject;
                console.log(now);
                setProject(now);
              }}
            >
              Full info
            </button>
          ),
        };

        items.push(dataItem);
      }
    }
    return items;
  }, [project, reciept]); // Add year as a dependency

  useEffect(() => {
    console.log(infoFull);
    setInfo(String(infoFull));
  }, [project]);

  useEffect(() => {
    const result = dataItems.filter(item => {
      return item.id.toString().toLowerCase().includes(search.toLowerCase());
    });
    setFilter(result);
  }, [dataItems, search]);
  return (
    <div className="table">
      <DataTable
        title="Contact List"
        columns={columns}
        data={filter}
        pagination
        subHeader
        fixedHeader
        customStyles={customStyles}
        subHeaderComponent={
          <input
            type="text"
            className="w-25 form-control p-1"
            placeholder="Search..."
            value={search}
            onChange={e => SetSearch(e.target.value)}
          />
        }
      />
      {info}
    </div>
  );
}

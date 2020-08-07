import axios from "axios";
// import "./App.css";

import React from "react";
import styled from "styled-components";
import { FixedSizeList } from "react-window";
import CssBaseline from "@material-ui/core/CssBaseline";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useBlockLayout,
  useFlexLayout,
  useRowSelect,
} from "react-table";

import matchSorter from "match-sorter";

const Styles = styled.div`
  padding: 1rem;

  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      font-size: 12px;
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

Object.filter = function (obj, prop) {
  let result = {},
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && key !== prop) {
      result[key] = obj[key];
    }
  }

  return result;
};

const deleteData = async (rowID) => {
  const { data } = this.state;
  const industry = data[rowID].industry;
  let newIndustry;
  if (industry === "Petro Chemicals") {
    newIndustry = "petroChemicals";
  }
  if (industry === "Trucking") {
    newIndustry = "trucking";
  }
  if (industry === "Oil and Gas") {
    newIndustry = "oilAndGas";
  }
  if (industry === "Manufacturing") {
    newIndustry = "manufacturing";
  }
  await axios.put(newIndustry + "/handleDelete/" + rowID).then((res) => {
    return res.data;
  });
  window.location.reload(true);
};

const updateData = async (rowID) => {
  // let data = await axios.put("/api/petroChemicals/" + rowID).then((res) => {
  //   return res.data;
  // });
  // window.location.reload(true);
  console.log("Seen");
};

const checkBox = (row) => {
  if (row.values.deleted === "false") {
    return (
      <div>
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        <p>Delete</p>
      </div>
    );
  }
};

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} />
      </>
    );
  }
);

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    rows,
    prepareRow,
    totalColumnsWidth,

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // filter
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },

    allColumns,
    getToggleHideAllColumnsProps,

    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    // useFlexLayout,
    // useBlockLayout,
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "delete",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <p>Delete</p>
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div
              onClick={() => {
                deleteData(row.values._id);
              }}
            >
              {checkBox(row)}
            </div>
          ),
        },
        ...columns,
      ]);
    },
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "seen",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <p>Seen</p>
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div
              onClick={() => {
                updateData(row.values._id);
              }}
            >
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              <p>Seen</p>
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <>
      <img src="logo.png" />
      {/* <div>
        <div>
          <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
          All
        </div>
        {allColumns.map(column => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
              {column.id}
            </label>
          </div>
        ))}
        <br />
      </div> */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <br />
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...data[i].__id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
      <br />
      {/* <div>Showing the first 10 results of {page.length} rows</div> */}
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          _id: undefined,
          benefits: undefined,
          capabilities: undefined,
          jobClassification: undefined,
          deleted: undefined,
          new: undefined,
          jobDescription: undefined,
          essentialFunctions: undefined,
          skillsAndExperience: undefined,
          salary: undefined,
          workLocations: undefined,
          company: undefined,
          url: undefined,
        },
      ],
    };
  }

  componentDidMount = () => {
    const routes = [
      "/api/petroChemicals/zachry",
      "/api/petroChemicals/turner",
      "/api/trucking/knightSwift",
      "/api/trucking/pilotFlyingJ",
      "/api/oilAndGas/halliburton",
      "/api/oilAndGas/schlumberger",
      "/api/manufacturing/pepsiCo",
    ];
    for (let i = 0; i < routes.length; i++) {
      axios.get(routes[i]).then((res) => {
        return res.data;
      });
    }
  };

  fetchData = async () => {
    const data = axios.get("/api/getAll").then((res) => {
      return res
    });

    console.log(data);

    for (let i = 0; i < data.length; i++) {
      data[i] = Object.filter(data[i], "__v");
      data[i].deleted = data[i].deleted.toString();
      data[i].new = data[i].new.toString();
    }
    // console.log(data);
    this.setState({ data });
    return data
  };

  render() {
    const { data } = this.state;
    const columns = Object.keys(data[0]).map((key, i) => {
      return {
        Header: (key.toString().charAt(0).toUpperCase() + key.slice(1))
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, function (str) {
            return str.toUpperCase();
          }),
        accessor: key,
        Cell: (cell) => {
          // console.log(data)
          if (cell.value && typeof cell.value === "object") {
            return (
              <ul>
                {cell.value.map((val, i) => {
                  return <li key={i}>{val}</li>;
                })}
              </ul>
            );
          }
          return <p>{cell.value}</p>;
        },
      };
    });

    return (
      <Styles>
        <CssBaseline />
        <Table data={data} columns={columns} />
      </Styles>
    );
  }
}

import axios from "axios";
import "./App.css";

import React from "react";
import { useTable } from "react-table";
import styled from "styled-components";

const Styles = styled.div`
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

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  // Render Data Table UI
  return (
    <table {...getTableProps()} className='table-light table-responsive'>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          benefits: undefined,
          capabilities: undefined,
          jobClassification: undefined,
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
    this.fetchData();
  };

  fetchData = async () => {
    let data = await axios.get("/api/petroChemicals").then((res) => {
      return res.data;
    });

    for (let i = 0; i < data.length; i++) {
      data[i] = Object.filter(data[i], "_id");
      data[i] = Object.filter(data[i], "__v");
    }
    // console.log(data);
    this.setState({ data });
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
        Cell: cell => {
          if(cell.value && typeof cell.value !== 'string'){
            return (<ul>
              {cell.value.map((val,i)=>{
                return <li key={i}>{val}</li>
              })}
            </ul>)
          }
          return <p>{cell.value}</p>
        }
    }});

    return (
      <Styles>
        <Table data={data} columns={columns} />
      </Styles>
    );
  }
}

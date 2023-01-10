import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBSpinner,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [value, setValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(100);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");
  const [isLoading, setLoading] = useState(true)


  useEffect(() => {
    loadUsersData(0, 10, 0);
  }, []);

  const loadUsersData = async (
    start,
    end,
    increase,
    optType = null,
    filterValue
  ) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setFilterValue("");
        return await axios
          .get(
            `http://localhost:5000/college_data?q=${value}&_start=${start}&_end=${end}`
          )
          .then((response) => {
           
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      case "filter":
        setOperation(optType);
        setSortFilterValue(filterValue);
        return await axios
          .get(
            `http://localhost:5000/college_data?state-province=${filterValue}&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      default:
        setOperation(optType);
        setFilterValue("");
        setLoading(true);
        return await axios
          .get(`http://localhost:5000/college_data?_start=${start}&_end=${end}`)
          .then((response) => {
            let state = [];
            setData(response.data);

            for (let st of response.data) {
              if (state.indexOf(st["state-province"]) === -1 && st["state-province"] !== null) {
                  state.push(st["state-province"]);
              }
            }
            setStateData(state);
            setTimeout(function () {
              setLoading(false);
            }, 300);
            
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
    }
  };

  
  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setFilterValue("");
    loadUsersData(0, 10, 0);
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    loadUsersData(0, 10, 0, "search");
  };

  
  const handleFilter = async (e) => {
    let value = e.target.value;
    (value === "Please Select Value") ? loadUsersData(0, 10, 0) : loadUsersData(0, 10, 0, "filter", value);
    setFilterValue(value);
    renderPagination()
  };

  const renderPagination = () => {
    if (data.length < 10 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData(10, 20, 1, operation)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && (data.length*10) === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData(
                  (currentPage - 1) * 10,
                  currentPage * 10,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData(
                  (currentPage + 1) * 10,
                  (currentPage + 2) * 10,
                  1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData(
                  (currentPage - 1) * 10,
                  currentPage * 10,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search Name ... "
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>
      <div style={{ marginTop: "100px" }}>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Webpage</th>
                  <th scope="col">Country</th>
                  <th scope="col">Domain</th>
                  <th scope="col">State</th>
                </tr>
              </MDBTableHead>
              {isLoading ? (
                <MDBSpinner role='status'>
                <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>):(
                data.length === 0 ? (
                <MDBTableBody className="align-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.web_pages}</td>
                      <td>{item.country}</td>
                      <td>{item.domains}</td>
                      <td>{item["state-province"]}</td>
                    </tr>
                  </MDBTableBody>
                ))
              ))}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center",
          }}
        >
          {renderPagination()}
        </div>
      </div>

      {data.length > 0 && (
        <MDBRow>
          <MDBCol size="8">
            <h5>Filter By State:</h5>
            <select
              style={{ width: "50%", borderRadius: "2px", height: "35px" }}
              onChange={handleFilter}
              value={filterValue}
            >
              <option>Please Select Value</option>
              {stateData.map((item, index) => (
                <option value={item} key={index}>
                  {item} 
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;
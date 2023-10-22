import { useState } from "react";
import "./App.css";
import {
  SpaceXDataProvider,
  useSpaceXData,
} from "./components/SpaceXDataContext";
import dayjs from "dayjs";

const ITEMS_PER_PAGE = 9;

const App: React.FC = () => {
  //fetching data
  const {
    data,
    loading,
    error,
    currentPage,
    setCurrentPage,
    upcomingOnly,
    setFilterUpcoming,
    filterSuccess,
    setFilterSuccess,
    filterFailed,
    setFilterFailed,
  } = useSpaceXData();
  //search filter
  const [searchInput, setSearchInput] = useState("");
  //select filter
  const [selectedStatus, setSelectedStatus] = useState("");

  //search filterd
  const filteredData = data.filter((item) =>
    item.rocket.rocket_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  //filter with status
  const filteredDataWithFilters = filteredData.filter((item) => {
    if (selectedStatus === "success") {
      return item.launch_success;
    } else if (selectedStatus === "failed") {
      return !item.launch_success;
    }
    return true;
  });

  const filteredDataWithCheckbox = upcomingOnly
    ? filteredDataWithFilters.filter((item) => item.upcoming)
    : filteredDataWithFilters;

  //pagination
  const totalPages = Math.ceil(
    filteredDataWithCheckbox.length / ITEMS_PER_PAGE
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const itemsToDisplay = filteredDataWithCheckbox.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <h1 className="text-center">Spaceflight details</h1>
      <div className="search-section d-flex justify-content-between">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* button */}
        <div className="form-group">
          <select
            id="statusFilter"
            className="form-control form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">By Launch Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="check-filter">
          <input
            type="checkbox"
            className="form-check-input"
            id="upcomingCheckbox"
            checked={upcomingOnly}
            onChange={() => setFilterUpcoming(!upcomingOnly)}
          />
          <label className="form-check-label" htmlFor="upcomingCheckbox">
            Show upcoming only
          </label>
        </div>
      </div>

      <div className="my-div">
        {itemsToDisplay.map((item, index) => (
          <div className="cover-sec" key={index}>
            <div className="image_container">
              <img src={item.links.mission_patch_small} alt="image" />
            </div>
            <p>
              Launch Date:
              {dayjs(item.launch_date_local).format("D MMMM, YYYY")}
            </p>
            <h3>{item.mission_name}</h3>
            <p> {item.rocket.rocket_name} </p>
            <p>Launch Status:</p>
            <p className={`${item.launch_success ? "green" : "red"}`}>
              {item.launch_success ? "Success" : "Failed"}
            </p>
          </div>
        ))}
      </div>

      {/* pagination */}
      <div className="d-flex justify-content-center">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <button className="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {pageNumbers.map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                <button className="page-link">{pageNumber}</button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <button className="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

const AppWithSpaceXData: React.FC = () => {
  return (
    <SpaceXDataProvider>
      <App />
    </SpaceXDataProvider>
  );
};

export default AppWithSpaceXData;

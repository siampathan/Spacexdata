import { useState } from "react";
import "./App.scss";
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
    dateFilter,
    setDateFilter,
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

  //filter data based on the selected date filter
  const filteredDataWithDateFilter = filteredDataWithFilters.filter((item) => {
    if (dateFilter === "lastWeek") {
      return dayjs().diff(dayjs(item.launch_date_local), "week") <= 1;
    } else if (dateFilter === "lastMonth") {
      return dayjs().diff(dayjs(item.launch_date_local), "month") <= 1;
    } else if (dateFilter === "lastYear") {
      return dayjs().diff(dayjs(item.launch_date_local), "year") <= 1;
    } else if (dateFilter === "last3Year") {
      return dayjs().diff(dayjs(item.launch_date_local), "year") <= 3;
    }
    return true;
  });

  const filteredDataWithCheckbox = upcomingOnly
    ? filteredDataWithDateFilter.filter((item) => item.upcoming)
    : filteredDataWithDateFilter;

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
      <div className="header-sec">
        <h3>Spaceflight details</h3>
        <p>
          Find out the elaborate features of all the past big spaceflights.{" "}
        </p>
      </div>

      {/* search filter */}
      <div className="search-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="filter-sec">
          {/* checkbox filter */}
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

          <div className="select-filter">
            {/* Status */}
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

            {/* filterd by week, month and year */}
            <div className="form-group">
              <select
                id="dateFilter"
                className="form-control form-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">By Launch Date</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastYear">Last Year</option>
                <option value="last3Year">Last 3 Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* rendering from API */}
      <div className="my-div">
        {itemsToDisplay.map((item, index) => (
          <div className="cover-sec" key={index}>
            <div className="image_container">
              <img src={item.links.mission_patch_small} alt="image" />
            </div>
            <p className="text-secondary">
              Launch Date :
              <span className="text-muted">
                {dayjs(item.launch_date_local).format(" D MMMM, YYYY")}
              </span>
            </p>
            <h3 className="ps-2 pe-2">{item.mission_name}</h3>
            <p className="text-muted"> {item.rocket.rocket_name} </p>
            <p className="text-black-50">Launch Status :</p>
            <p
              className={`badge ${
                item.launch_success ? "text-bg-success" : "text-bg-danger"
              }`}
            >
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

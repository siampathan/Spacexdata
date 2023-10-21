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
  const { data, loading, error, currentPage, setCurrentPage } = useSpaceXData();
  //search filter
  const [searchInput, setSearchInput] = useState("");
  console.log(searchInput);

  //search filterd
  const filteredData = data.filter((item) =>
    item.rocket.rocket_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  //pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const itemsToDisplay = filteredData.slice(
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
      <h1>Fetched Data:</h1>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
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

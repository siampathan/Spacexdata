import { useState } from "react";
import "./App.css";
import {
  SpaceXDataProvider,
  useSpaceXData,
} from "./components/SpaceXDataContext";
import dayjs from "dayjs";

const App: React.FC = () => {
  const { data, loading, error } = useSpaceXData();
  const [search, setSearch] = useState("");
  console.log(search);

  console.log(data);

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
        <input type="text" onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="my-div">
        {data
          .filter((item) => {
            return search.toLocaleLowerCase() === ""
              ? item
              : item.rocket.rocket_name.toLocaleLowerCase().includes(search);
          })
          .map((item, index) => (
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

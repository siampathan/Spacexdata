import "./App.css";
import {
  SpaceXDataProvider,
  useSpaceXData,
} from "./components/SpaceXDataContext";
import dayjs from "dayjs";

const App: React.FC = () => {
  const { data, loading, error } = useSpaceXData();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <h1>Fetched Data: Type Script and UseContext</h1>

      <div className="my-div">
        {data.map((item, index) => (
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

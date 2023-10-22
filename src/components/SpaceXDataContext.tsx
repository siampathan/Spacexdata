import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

// data type
interface LaunchData {
  links: {
    mission_patch_small: string;
  };
  launch_date_local: string;
  mission_name: string;
  rocket: {
    rocket_name: string;
  };
  launch_success: boolean;
  upcoming: boolean;
}

// context type
interface SpaceXDataContextType {
  data: LaunchData[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  upcomingOnly: boolean;
  setFilterUpcoming: (upcoming: boolean) => void;
  filterSuccess: boolean;
  setFilterSuccess: (success: boolean) => void;
  filterFailed: boolean;
  setFilterFailed: (failed: boolean) => void;
  selectedDay: string;
  setSelectedDay: (status: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
}

const SpaceXDataContext = createContext<SpaceXDataContextType | undefined>(
  undefined
);

export const useSpaceXData = () => {
  const context = useContext(SpaceXDataContext);
  if (!context) {
    throw new Error("useSpaceXData must be used within a SpaceXDataProvider");
  }
  return context;
};

interface SpaceXDataProviderProps {
  children: ReactNode;
}

export const SpaceXDataProvider: React.FC<SpaceXDataProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<LaunchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [filterSuccess, setFilterSuccess] = useState(false);
  const [filterFailed, setFilterFailed] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetch(`https://api.spacexdata.com/v3/launches`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json() as Promise<LaunchData[]>;
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  //current page from localStorage on initial load
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  // current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", String(currentPage));
  }, [currentPage]);

  return (
    <SpaceXDataContext.Provider
      value={{
        data,
        loading,
        error,
        currentPage,
        setCurrentPage,
        upcomingOnly,
        setFilterUpcoming: setUpcomingOnly,
        filterSuccess,
        setFilterSuccess,
        filterFailed,
        setFilterFailed,
        selectedDay,
        setSelectedDay,
        dateFilter,
        setDateFilter,
      }}
    >
      {children}
    </SpaceXDataContext.Provider>
  );
};

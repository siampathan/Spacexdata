// SpaceXDataContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

// Define the data type
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
}

// Define the context type
interface SpaceXDataContextType {
  data: LaunchData[];
  loading: boolean;
  error: Error | null;
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

  return (
    <SpaceXDataContext.Provider value={{ data, loading, error }}>
      {children}
    </SpaceXDataContext.Provider>
  );
};

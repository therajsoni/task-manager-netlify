"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type RefreshDataContextType = {
  addProjectDBRefreshDB: boolean;
  setAddProjectDBRefreshDB: Dispatch<SetStateAction<boolean>>;
  addTaskDBRefreshDB: boolean;
  setAddTaskDBRefreshDB: Dispatch<SetStateAction<boolean>>;
};
const RefreshDatasContext = createContext<RefreshDataContextType>({
  addProjectDBRefreshDB: false,
  setAddProjectDBRefreshDB: () => {},
  addTaskDBRefreshDB: false,
  setAddTaskDBRefreshDB: () => {},
});

export const RefreshDataProvider = ({ children }: { children: ReactNode }) => {
  const [addProjectDBRefreshDB, setAddProjectDBRefreshDB] = useState(false);
  const [addTaskDBRefreshDB, setAddTaskDBRefreshDB] = useState(false);

  return (
    <RefreshDatasContext.Provider
      value={{
        addProjectDBRefreshDB,
        setAddProjectDBRefreshDB,
        addTaskDBRefreshDB,
        setAddTaskDBRefreshDB,
      }}
    >
      {children}
    </RefreshDatasContext.Provider>
  );
};
export const useRefreshDBProvider = () => useContext(RefreshDatasContext);

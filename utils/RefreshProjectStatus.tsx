"use client";
import { createContext, Dispatch, ReactNode, useContext, useState } from "react";
type ProjectRefresh = {
    refreshDataAgain: boolean,
    setRefreshDataAgain: Dispatch<any>
}
const RefreshContext = createContext<ProjectRefresh>({
    refreshDataAgain: false,
    setRefreshDataAgain: async () => { }
});
export const UpdateTaskProvider = ({ children }: { children: ReactNode }) => {
    const [refreshDataAgain, setRefreshDataAgain] = useState<boolean>(false);
    return (<RefreshContext.Provider value={{
        refreshDataAgain,
        setRefreshDataAgain
    }}>{children}</RefreshContext.Provider>)
}
export const useProjectFetchStata = () => useContext(RefreshContext);
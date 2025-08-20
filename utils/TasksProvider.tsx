"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type TaskContextType = {
    taskData : any,
    setTaskData : Dispatch<any>,
}

const TaskContext = createContext<TaskContextType>({
    taskData : null,
    setTaskData : () => {},
});

// Provider
export const TaskContextProvider = ({children}:{
    children : ReactNode
}) => {
    const [taskData,setTaskData] = useState<any>();
    return (
        <TaskContext.Provider value={{
            taskData,
            setTaskData,
        }}>
            {children}
        </TaskContext.Provider>
    )
}

// Hook 
export const useTask = () => useContext(TaskContext);
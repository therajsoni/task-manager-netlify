"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
type TaskContextType = {
  tasks: any;
  loadingTask: boolean;
  submitTask: ({ id, tasks }: any) => void;
  taskUpdate: ({ id, tasks }: any) => void;
  fetchTask: ({ id }: any) => void;
};
const TaskContext = createContext<TaskContextType>({
  // value pass define there
  tasks: [],
  loadingTask: false,
  submitTask: async () => {},
  taskUpdate: async () => {},
  fetchTask: async () => {},
});
export const taskProvider = ({ children }: { children: ReactNode }) => {
  const [taskData, setTaskData] = useState<any>();
  const [loadingTask, setLoadingTask] = useState<boolean>(false);
  const submitTask = async ({ id, tasks }: any) => {
    setLoadingTask(false);
    const request = await fetch("/api/fallbackTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: `${id}`,
        data: tasks,
      }),
      cache: "no-store",
    });
    const response = await request.json();
    if (request.ok && response.success) {
      toast.success("Task updated");
    } else {
      toast.error(response.message);
    }
    setLoadingTask(false);
  };
  const taskUpdate = async ({ id, tasks }: { id: string; tasks: any }) => {
    setLoadingTask(true);
    const request = await fetch("/api/tasks/update", {
      method: "PUT",
      body: JSON.stringify({
        projectId: id,
        updatedTaskTree: tasks,
      }),
    });
    setLoadingTask(false);
    return request;
  };
  const fetchTask = async ({ id }: { id: string }) => {
    setLoadingTask(true);
    const request = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        projectId: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    if (request.ok && response.success) {
      setTaskData(response?.data);
    } else {
      toast.error("Error in fetching taks");
    }
    setLoadingTask(false);
  };
  return (
    <TaskContext.Provider
      value={{
        tasks: taskData,
        loadingTask,
        submitTask,
        taskUpdate,
        fetchTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
export const useTask = () => useContext(TaskContext);

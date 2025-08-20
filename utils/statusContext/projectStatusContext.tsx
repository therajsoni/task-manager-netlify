"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Task = {
  id: string;
  name: string;
  status: string;
  children?: Task[];
};

interface PercentageContextType {
  projectPercentages: Record<string, number>;
  calculateAndSetProjectPercentages: (projects: Record<string, Task[]>) => void;
}

const PercentageContext = createContext<PercentageContextType | undefined>(undefined);

export const PercentageProvider = ({ children }: { children: ReactNode }) => {
  const [projectPercentages, setProjectPercentages] = useState<Record<string, number>>({});

  const calculatePercentage = (task: Task): number => {
    if (!Array.isArray(task.children) || task.children.length === 0) {
      return task.status === "completed" ? 100 : 0;
    }

    const childPercentages = task.children.map(calculatePercentage);
    const total = childPercentages.reduce((sum, val) => sum + val, 0);
    return Math.round(total / childPercentages.length);
  };

  const calculateAndSetProjectPercentages = (projects: Record<string, Task[]>) => {
    const newPercentages: Record<string, number> = {};

    for (const [projectId, tasks] of Object.entries(projects)) {
      if (!Array.isArray(tasks) || tasks.length === 0) {
        newPercentages[projectId] = 0;
        continue;
      }

      const taskAverages = tasks.map(calculatePercentage);
      const total = taskAverages.reduce((sum, val) => sum + val, 0);
      newPercentages[projectId] = Math.round(total / taskAverages.length);
    }

    setProjectPercentages(newPercentages);
  };

  return (
    <PercentageContext.Provider value={{ projectPercentages, calculateAndSetProjectPercentages }}>
      {children}
    </PercentageContext.Provider>
  );
};

export const usePercentage = (): PercentageContextType => {
  const context = useContext(PercentageContext);
  if (!context) {
    throw new Error("usePercentage must be used within a PercentageProvider");
  }
  return context;
};
